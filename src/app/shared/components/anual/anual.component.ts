import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import {EChartsOption} from 'echarts'
import { DefineGraficoAnualOption } from '../../../utils/functions/anual';
import { SystemService } from '../../services/system.service';
import { DespesasService } from '../../services/despesas.service';
import { Despesa } from '../../models/despesa';
import { ToastrService } from 'ngx-toastr';
import { ParcelasService } from '../../services/parcelas.service';
import { Ano } from '../../../utils/meses';
import { FormsModule } from '@angular/forms';
import { After } from 'v8';
@Component({
  selector: 'app-anual',
  standalone: true,
  imports: [
    CommonModule, 
    NgxEchartsDirective,
    FormsModule
  ],
  templateUrl: './anual.component.html',
  styleUrl: './anual.component.css'
})
export class AnualComponent implements OnInit, AfterViewInit{

  chartAnualOption!: EChartsOption;
  despesas: {despesa: Despesa, qtdParcelas: number, dataFinal: Date}[] = [];
  ano: Ano = new Ano();

  constructor(
    private readonly despesaService: DespesasService,
    private readonly toastrService: ToastrService,
    private readonly parcelasService: ParcelasService
  ){}
  ngAfterViewInit(): void {
    this.despesas.sort((a, b) => {
      return a.despesa.dataCompra.getUTCMonth() - b.despesa.dataCompra.getUTCMonth()
    })
  }

  ngOnInit(): void {
    this.despesaService.GetDespesas().subscribe({
      next: (success: Despesa[]) => {
        const despesasParceladas = success.filter(filtro => filtro.isParcelada);
        despesasParceladas.forEach( parcelada => {
          this.parcelasService.GetParcelasByDespesa(parcelada.id).subscribe( x => {
            parcelada.dataCompra = new Date(parcelada.dataCompra);
            this.despesas.push({despesa: parcelada, qtdParcelas: x.length, dataFinal: this.calcularDataFinal(parcelada.dataCompra.toISOString(), x.length)});
          });
        });
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