import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import {EChartsOption} from 'echarts'
import { DefineGraficoAnualOption } from '../../../utils/functions/anual';
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

  chartAnualOption!: EChartsOption;

  constructor(
    private systemService: SystemService
  ){}
  ngOnInit(): void {
    this.chartAnualOption = DefineGraficoAnualOption(this.systemService.entradas, this.systemService.saidas);
  }
   
  
}