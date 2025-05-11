import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ToastrService } from 'ngx-toastr';
import { Despesa } from '../../../shared/models/despesa';
import { DespesasService } from '../../../shared/services/despesas.service';
import { ParcelasService } from '../../../shared/services/parcelas.service';
import { SystemService } from '../../../shared/services/system.service';
import { Ano } from '../../../utils/meses';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-objetivos',
  imports: [
    CommonModule
  ],
  templateUrl: './objetivos.component.html',
  styleUrl: './objetivos.component.css'
})
export class ObjetivosComponent implements OnInit, AfterViewInit{

  chartAnualOption!: EChartsOption;
  despesas: {despesa: Despesa, qtdParcelas: number, dataFinal: Date}[] = [];
  ano: Ano = new Ano(this.systemService.ano.valor);

  constructor(
    private readonly despesaService: DespesasService,
    private readonly toastrService: ToastrService,
    private readonly parcelasService: ParcelasService,
    private readonly systemService: SystemService
  ){}
  ngAfterViewInit(): void {
    this.despesas.sort((a, b) => {
      return a.despesa.DataCompra.getUTCMonth() - b.despesa.DataCompra.getUTCMonth()
    })
  }

  ngOnInit(): void {
    this.despesaService.GetDespesas(this.systemService.ano.valor).subscribe({
      next: (success: Despesa[]) => {
        const despesasParceladas = success.filter(filtro => filtro.IsParcelada );
        console.log(despesasParceladas)
        despesasParceladas.forEach( parcelada => {
          this.parcelasService.GetParcelasByDespesa(parcelada.Id).subscribe( x => {
            console.log(x);
            parcelada.DataCompra = new Date(parcelada.DataCompra);
            this.despesas.push({despesa: parcelada, qtdParcelas: x.length, dataFinal: this.calcularDataFinal(parcelada.DataCompra.toISOString(), x.length)});
          });
        });
        console.log(this.despesas)
       },
      error: (err:any) => {
        this.toastrService.error("não foi possível buscar as despesas", "Erro")
      }
    })
  }
   
  calcularDataFinal(dataInicio: string, parcelas: number): Date {
    const data = new Date(dataInicio);
    data.setMonth(data.getMonth() + parcelas - 1);
    return data;
  }
  
  calculaInicioFim(datainicio: Date = new Date(), datafim:Date = new Date()): string {
    let inicio = datainicio.getUTCMonth() + 1;
    let fim = 0;
    if(datainicio.getUTCFullYear()  < datafim.getUTCFullYear()) {
      fim = 13;
    }
    else {
      fim = datafim.getUTCMonth() + 2;
    }
    return `${inicio} / ${fim}`;
  }

}