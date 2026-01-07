import {  Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ToastrService } from 'ngx-toastr';
import { SystemService } from '../../../shared/services/system.service';
import { CommonModule } from '@angular/common';
import { TransacoesService } from '../../../shared/services/transacoes.service';
import { LinhaTemporal } from '../../../shared/models/linha-temporal.model';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5Gantt from '@amcharts/amcharts5/gantt'
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { converterParaGantt } from '../../../utils/functions/converteperGantt';


@Component({
  selector: 'app-objetivos',
  imports: [
    CommonModule
],
  templateUrl: './objetivos.component.html',
  styleUrl: './objetivos.component.css'
})
export class ObjetivosComponent implements OnInit {
  @ViewChild('chartDiv', { static: true }) chartDiv!: ElementRef<HTMLDivElement>;

  chartAnualOption!: EChartsOption;
  despesas: LinhaTemporal[] = [];
  ano$ = this.systemService.ano$;
  private root!: am5.Root;

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
        this.createGrafico()
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

  createGrafico() {
    
    if (this.root) {
      this.root.dispose();
    }

    this.root = am5.Root.new(this.chartDiv.nativeElement);
    (this.root as any)._logo?.dispose();

    this.root.setThemes([
      am5themes_Animated.new(this.root)
    ]);

    const gantt = this.root.container.children.push(
      am5Gantt.Gantt.new(this.root, {
        layout: this.root.verticalLayout
      })
    );

    // 🔹 Configura eixos existentes
    gantt.xAxis.setAll({
      baseInterval: { timeUnit: "month", count: 1 }
    });

    gantt.yAxis.setAll({
      categoryField: "id"
    });

    // 🔹 DADOS
    const { categoryData, seriesData } = converterParaGantt(this.despesas);

    gantt.yAxis.data.setAll(categoryData);

    gantt.appear(1000, 100);
  }



}