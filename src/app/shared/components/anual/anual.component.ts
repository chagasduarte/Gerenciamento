import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import {EChartsOption} from 'echarts'
import { DefineGraficoOption } from '../../../utils/functions/anual';
import { EntradasService } from '../../services/entradas.service';
import { DespesasService } from '../../services/despesas.service';
import { SystemService } from '../../services/system.service';
@Component({
  selector: 'app-anual',
  standalone: true,
  imports: [
    CommonModule, NgxEchartsDirective
  ],
  templateUrl: './anual.component.html',
  styleUrl: './anual.component.css'
})
export class AnualComponent implements OnInit{

  chartOption!: EChartsOption;

  constructor(
    private systemService: SystemService
  ){}
  ngOnInit(): void {
    this.chartOption = DefineGraficoOption(this.systemService.entradas, this.systemService.saidas);
  }
   
  
}