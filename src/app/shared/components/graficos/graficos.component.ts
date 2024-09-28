import { AfterViewInit, Component, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';
import { MesGrafico } from '../../models/graficos';
import { DefineCor } from '../../../utils/functions/defineCorGrafico';

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

  graficos!: MesGrafico[];

  contas: number[] = []
  constructor(
    private readonly contasService: ContasService,
    public systemService: SystemService,
    private readonly despesasService: DespesasService,
    private readonly router: Router,
  ){}
  
  ngOnInit(): void {
    
  }
  DefinirCor(valor: number): any {
    return DefineCor(valor)
  }
}
