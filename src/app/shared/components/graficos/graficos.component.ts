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
  graficoPizzaCategoria: EChartsOption = DefineGraficoCategoria();
  chartAnualOption!: EChartsOption;

  contas: number[] = []
  constructor(
    private readonly contasService: ContasService,
    private readonly systemService: SystemService
  ){}
  ngOnInit(): void {
    this.buscaContas();
    this.chartAnualOption = DefineGraficoAnualOption(this.systemService.entradas, this.systemService.saidas);
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



}
