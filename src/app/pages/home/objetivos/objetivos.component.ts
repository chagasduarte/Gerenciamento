import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ToastrService } from 'ngx-toastr';
import { Despesa } from '../../../shared/models/despesa';
import { SystemService } from '../../../shared/services/system.service';
import { Ano } from '../../../utils/meses';
import { CommonModule } from '@angular/common';
import { TransacaoModel } from '../../../shared/models/despesa.model';
import { TransacoesService } from '../../../shared/services/transacoes.service';
import { LinhaTemporal } from '../../../shared/models/linha-temporal.model';
import { PlanejamentoComponent } from "../../../shared/components/planejamento/planejamento.component";

@Component({
  selector: 'app-objetivos',
  imports: [
    CommonModule,
    PlanejamentoComponent
],
  templateUrl: './objetivos.component.html',
  styleUrl: './objetivos.component.css'
})
export class ObjetivosComponent implements OnInit {

  chartAnualOption!: EChartsOption;
  despesas: LinhaTemporal[] = [];
  ano$ = this.systemService.ano$;
  constructor(
    private readonly toastrService: ToastrService,
    private readonly systemService: SystemService,
    private readonly transacao: TransacoesService
  ){}

  ngOnInit(): void {
    this.buscaLinhadoTempo();
    this.ano$.subscribe(ano => {
      this.buscaLinhadoTempo();
    })
  }
  buscaLinhadoTempo(){
    this.transacao.GetLinhaTemporal(this.systemService.ano.valor).subscribe({
      next: (success) => {
        this.despesas = success;
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
    datainicio = new Date(datainicio);
    datafim = new Date(datafim);
    
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