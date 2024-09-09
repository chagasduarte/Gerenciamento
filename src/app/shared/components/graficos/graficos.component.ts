import { Component, OnInit } from '@angular/core';
import { ContasService } from '../../services/contas.service';
import { Conta } from '../../models/conta';
import { EChartsOption } from 'echarts';
import { NgxEchartsDirective } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { DefineGraficoProgressaoMensal } from '../../../utils/functions/defineGraficoProgressaoMensal';
import { DefineGraficoCategoria } from '../../../utils/functions/definGraficoPizzaCategoria';
import { DefineGraficoAnualOption } from '../../../utils/functions/anual';
import { SystemService } from '../../services/system.service';
import { DespesasService } from '../../services/despesas.service';
import { Despesa } from '../../models/despesa';

@Component({
  selector: 'app-graficos',
  standalone: true,
  imports: [
    CommonModule,
    NgxEchartsDirective
  ],
  templateUrl: './graficos.component.html',
  styleUrl: './graficos.component.css'
})
export class GraficosComponent implements OnInit{

  graficoPrograssaoMensal!: EChartsOption;
  graficoPizzaCategoria!: EChartsOption;
  chartAnualOption!: EChartsOption;

  contas: number[] = []
  constructor(
    private readonly contasService: ContasService,
    private readonly systemService: SystemService,
    private readonly despesasService: DespesasService
  ){}
  ngOnInit(): void {
    this.buscaContas();
    this.chartAnualOption = DefineGraficoAnualOption(this.systemService.entradas, this.systemService.saidas);
    this.buscaDespesas()
  }
   
  buscaContas(){
    this.contasService.GetContas().subscribe(x => {
      x.map( conta => {
        if (this.contas[conta.mes - 1]){
          this.contas[conta.mes - 1] += conta.debito;
        }
        else {
          this.contas[conta.mes - 1] = conta.debito;
        }
      });
      this.graficoPrograssaoMensal = DefineGraficoProgressaoMensal(this.contas);
    });
  }

  buscaDespesas() {
    this.despesasService.GetDespesasByMes(this.systemService.mes.valor).subscribe({
      next: (success: Despesa[]) => {
        this.graficoPizzaCategoria = DefineGraficoCategoria(success);
      }
    })
  }

}
