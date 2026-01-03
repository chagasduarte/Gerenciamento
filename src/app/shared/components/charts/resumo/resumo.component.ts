import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';

import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { SystemService } from '../../../services/system.service';

interface PieData {
  tipo: string;
  valor: number;
  color: am5.Color;
}


@Component({
  selector: 'app-resumo',
  imports: [],
  templateUrl: './resumo.component.html',
  styleUrl: './resumo.component.css'
})
export class ResumoComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('chartDiv', { static: true }) chartDiv!: ElementRef<HTMLDivElement>;
  resumoMensal$ = this.systemService.resumo$; // <-- é reativo

  salario!: number;
  valorComprometido!: number;  
  saldoAcumulado!: number;

  private root!: am5.Root;
  private labels: am5.Label[] = [];
  
  constructor(
    private readonly systemService: SystemService
  ){}

  ngOnInit(): void {
    
  }
  
  ngAfterViewInit(): void {
    this.resumoMensal$.subscribe({
      next: (success) => {
        this.salario = success?.receita_mensal!;
        this.saldoAcumulado = success?.saldo_acumulado!;
        this.valorComprometido = success?.gastos_mensal!;
        this.criarGrafico();
      }
    })
  }

  private criarGrafico(): void {

    if (this.root) {
      this.root.dispose(); // 🔥 remove gráfico antigo
    }

    this.root = am5.Root.new(this.chartDiv.nativeElement);
    /* REMOVE O LOGO DO AMCHARTS */
    (this.root as any)._logo?.dispose();
    
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    const chart = this.root.container.children.push(
      am5percent.PieChart.new(this.root, {
        layout: this.root.verticalLayout,
        radius: am5.percent(100), // 🔥 ocupa tudo
      })
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(this.root, {
        valueField: 'valor',
        categoryField: 'tipo'
      })
    );
    series.slices.template.setAll({
      templateField: "sliceSettings",
      strokeOpacity: 0
    });
    const salario = this.salario;
    const gastos = this.valorComprometido;

    if (gastos <= salario) {
      series.data.setAll([
        {
          valor: gastos,
          tipo: 'Comprometido',
          sliceSettings: {
            fill: am5.color(0x31727a),
          }
        },
        {
          valor: salario - gastos,
          tipo: 'Livre',
          sliceSettings: {
            fill: am5.color(0x3e8f52),
          }
        }
      ]);
    } else {
      series.data.setAll([
        {
          valor: salario - (gastos - salario),
          tipo: 'Comprometido',
          sliceSettings: {
            fill: am5.color(0x31727a),
          }
        },
        {
          valor: gastos - salario,
          tipo: 'Excedente',
          sliceSettings: {
            fill: am5.color(0x9c3a1c),
          }
        }
      ]);
    }

    series.slices.template.adapters.add("fill", (fill, target) => {
      const dataItem = target.dataItem;
      if (!dataItem) return fill;

      const data = dataItem.dataContext as PieData;
      return data.color ?? fill;
    });

    series.slices.template.adapters.add("stroke", (stroke, target) => {
      const dataItem = target.dataItem;
      if (!dataItem) return stroke;

      const data = dataItem.dataContext as PieData;
      return data.color ?? stroke;
    });

    series.labels.template.setAll({
      forceHidden: true
    });

    series.ticks.template.setAll({
      forceHidden: true
    });

    
    const criarLabel = (x: number, y: number, color: number, size: number, 
      weight: "200" | "normal" | "bold" | "bolder" | "lighter" | "100" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | undefined) => 
    {
      const label = chart.children.push(
        am5.Label.new(this.root, {
          x: am5.percent(x),
          y: am5.percent(y),
          centerX: am5.percent(50),
          centerY: am5.percent(50),
          fontSize: size,
          fontWeight: weight,
          fill: am5.color(color)
        })
      );
      this.labels.push(label);
      return label;
    };

    this.labels = [];
    
    criarLabel(37, 25, 0xffffff, 15, "300"); // valor livre
    criarLabel(65, 25, 0xffffff, 15, "500"); // %
    criarLabel(50, 40, 0xffffff, 15, "300");       // saldo acumulado

    this.atualizarLabels();
  }


  private atualizarLabels(): void {
    if (this.labels.length < 3) return;
    const salario = this.salario ?? 0;
    const valorComprometido = this.valorComprometido ?? 0;
    const saldoAcumulado = this.saldoAcumulado ?? 0;
    
    const livre = salario - valorComprometido;
    
    console.log("acumulado", this.saldoAcumulado);
    console.log("comprometido", valorComprometido);
    const percentual = salario > 0
      ? ((valorComprometido / salario) * 100)
      : 0;
    console.log("percent", percentual);
    console.log("livre", livre);
    
    this.labels[0].set(
      'text',
      `R$ ${livre.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    );

    this.labels[1].set(
      'text',
      `${percentual.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}%`
    );

    this.labels[2].set(
      'text',
      `R$ ${saldoAcumulado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    );
  }
  

  ngOnDestroy(): void {
    if (this.root) {
      this.root.dispose();
    }
  }
}
