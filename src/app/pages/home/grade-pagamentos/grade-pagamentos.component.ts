import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CategoriaService } from '../../../shared/services/categoria.service';
import { TransacoesService } from '../../../shared/services/transacoes.service';
import { SystemService } from '../../../shared/services/system.service';
import { Categoria } from '../../../shared/models/categoria.model';
import { TransacaoModel } from '../../../shared/models/despesa.model';
import { Subscription, combineLatest } from 'rxjs';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-grade-pagamentos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grade-pagamentos.component.html',
  styleUrl: './grade-pagamentos.component.css'
})
export class GradePagamentosComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('chartDiv') chartDiv!: ElementRef<HTMLDivElement>;

  transacoes: TransacaoModel[] = [];
  diasDoMes: number[] = [];
  diasExibidos: number[] = [];
  transacoesPorDia: { [key: number]: TransacaoModel[] } = {};
  totalDespesas: number = 0;

  private root!: am5.Root;
  private sub = new Subscription();

  constructor(
    private transacoesService: TransacoesService,
    private systemService: SystemService,
    @Inject(PLATFORM_ID) private platformId: object
  ) { }

  ngOnInit(): void {
    this.sub.add(
      combineLatest([
        this.systemService.mes$,
        this.systemService.ano$
      ]).subscribe(([mes, ano]) => {
        this.gerarDias(mes.valor, ano.valor);
        this.carregarDados(mes.valor + 1, ano.valor);
      })
    );
  }

  private isViewReady = false;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isViewReady = true;
      if (this.transacoes.length > 0) {
        this.processarGrafico();
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (this.root) {
      this.root.dispose();
    }
  }

  private gerarDias(mes: number, ano: number): void {
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    this.diasDoMes = Array.from({ length: ultimoDia }, (_, i) => i + 1);
  }

  private carregarDados(mes: number, ano: number): void {
    this.transacoesService.Extrato(0, mes, ano).subscribe((transacoes) => {
      this.transacoes = transacoes;
      this.processarGrade();
      if (this.isViewReady) {
        this.processarGrafico();
      }
    });
  }

  private processarGrade(): void {
    const novaGrade: { [key: number]: TransacaoModel[] } = {};
    const diasComMovimentacao = new Set<number>();
    this.totalDespesas = 0;

    this.transacoes.forEach((t) => {
      const dia = this.getDiaDaTransacao(t.pagamento);
      const tipo = t.tipo?.toLowerCase();

      if (tipo === 'saida') {
        this.totalDespesas += parseFloat(t.valor.toString());
      }

      if (dia > 0) {
        diasComMovimentacao.add(dia);
        if (!novaGrade[dia]) {
          novaGrade[dia] = [];
        }
        novaGrade[dia].push(t);
      }
    });

    this.transacoesPorDia = novaGrade;
    this.diasExibidos = this.diasDoMes.filter(dia => diasComMovimentacao.has(dia));
  }

  private processarGrafico(): void {
    if (!isPlatformBrowser(this.platformId) || !this.chartDiv) return;

    if (this.root) {
      this.root.dispose();
    }

    const chartData: any[] = [];
    let acumuladoDiario = 0;

    this.diasDoMes.forEach(dia => {
      const transacoesDoDia = this.transacoes.filter(t => this.getDiaDaTransacao(t.pagamento) === dia);
      const somaSaidas = transacoesDoDia
        .filter(t => t.tipo?.toLowerCase() === 'saida')
        .reduce((acc, t) => acc + parseFloat(t.valor.toString()), 0);
      const somaEntradas = transacoesDoDia
        .filter(t => t.tipo?.toLowerCase() === 'entrada')
        .reduce((acc, t) => acc + parseFloat(t.valor.toString()), 0);

      acumuladoDiario += (somaEntradas - somaSaidas);

      chartData.push({
        dia: dia.toString(),
        saldo: parseFloat(acumuladoDiario.toFixed(2)),
        pagamentos: parseFloat(somaSaidas.toFixed(2)),
        receitas: parseFloat(somaEntradas.toFixed(2))
      });
    });

    // Usar setTimeout para garantir que o Angular terminou de renderizar o container
    setTimeout(() => {
      if (!this.chartDiv || !this.chartDiv.nativeElement) return;

      this.root = am5.Root.new(this.chartDiv.nativeElement);

      // Remove o logo do amCharts
      if ((this.root as any)._logo) {
        (this.root as any)._logo.dispose();
      }

      this.root.setThemes([am5themes_Animated.new(this.root)]);

      const chart = this.root.container.children.push(
        am5xy.XYChart.new(this.root, {
          panX: true,
          panY: false,
          wheelX: "panX",
          wheelY: "zoomX",
          layout: this.root.verticalLayout
        })
      );

      // Cores para o tema escuro
      const textColor = am5.color(0xd1e8ec);
      const gridColor = am5.color(0x0b2e36);
      const incomeColor = am5.color(0x4cc9f0);
      const expenseColor = am5.color(0xef4444);

      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(this.root, {
          categoryField: "dia",
          renderer: am5xy.AxisRendererX.new(this.root, {
            minGridDistance: 30,
            strokeOpacity: 0.1,
            stroke: gridColor
          }),
          tooltip: am5.Tooltip.new(this.root, {})
        })
      );

      xAxis.get("renderer").labels.template.setAll({
        fill: textColor,
        fontSize: 12
      });

      xAxis.data.setAll(chartData);

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(this.root, {
          renderer: am5xy.AxisRendererY.new(this.root, {
            strokeOpacity: 0.1,
            stroke: gridColor
          })
        })
      );

      yAxis.get("renderer").labels.template.setAll({
        fill: textColor,
        fontSize: 12
      });

      yAxis.get("renderer").grid.template.setAll({
        stroke: gridColor,
        strokeOpacity: 1
      });

      // Série de Barras (Receitas Diárias)
      const seriesEntradas = chart.series.push(
        am5xy.ColumnSeries.new(this.root, {
          name: "Receitas Diárias",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "receitas",
          categoryXField: "dia",
          tooltip: am5.Tooltip.new(this.root, {
            labelText: "[bold]Receitas:[/] {valueY.formatNumber('#,###.00')}"
          })
        })
      );
      seriesEntradas.columns.template.setAll({
        width: am5.percent(70),
        tooltipY: 0,
        fill: incomeColor,
        stroke: incomeColor,
        cornerRadiusTL: 4,
        cornerRadiusTR: 4
      });
      seriesEntradas.data.setAll(chartData);

      // Série de Barras (Pagamentos Diários)
      const seriesPagamentos = chart.series.push(
        am5xy.ColumnSeries.new(this.root, {
          name: "Gastos Diários",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "pagamentos",
          categoryXField: "dia",
          tooltip: am5.Tooltip.new(this.root, {
            labelText: "[bold]Gastos:[/] {valueY.formatNumber('#,###.00')}"
          })
        })
      );
      seriesPagamentos.columns.template.setAll({
        width: am5.percent(70),
        tooltipY: 0,
        fill: expenseColor,
        stroke: expenseColor,
        cornerRadiusTL: 4,
        cornerRadiusTR: 4
      });
      seriesPagamentos.data.setAll(chartData);

      // Série de Linha (Fluxo Acumulado)
      const seriesSaldo = chart.series.push(
        am5xy.LineSeries.new(this.root, {
          name: "Fluxo Acumulado",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "saldo",
          categoryXField: "dia",
          stroke: am5.color(0x7ac27a),
          tooltip: am5.Tooltip.new(this.root, {
            labelText: "[bold]Saldo:[/] {valueY.formatNumber('#,###.00')}"
          })
        })
      );
      seriesSaldo.strokes.template.setAll({
        strokeWidth: 3
      });
      seriesSaldo.fills.template.setAll({
        fillOpacity: 0.1,
        visible: true,
        fill: am5.color(0x7ac27a)
      });
      seriesSaldo.data.setAll(chartData);

      seriesSaldo.bullets.push(() => {
        return am5.Bullet.new(this.root, {
          sprite: am5.Circle.new(this.root, {
            radius: 4,
            fill: seriesSaldo.get("stroke")
          })
        });
      });

      // Cursor e Legenda
      const cursor = chart.set("cursor", am5xy.XYCursor.new(this.root, {}));
      cursor.lineY.set("visible", false);

      const legend = chart.children.push(am5.Legend.new(this.root, {
        centerX: am5.p50,
        x: am5.p50
      }));

      legend.labels.template.setAll({
        fill: textColor,
        fontSize: 12
      });
      legend.valueLabels.template.setAll({
        fill: textColor,
        fontSize: 12
      });

      legend.data.setAll(chart.series.values);

      chart.appear(1000, 100);
    }, 150);
  }

  private getDiaDaTransacao(dataObj: any): number {
    if (!dataObj) return 0;
    const date = new Date(dataObj);
    if (isNaN(date.getTime())) return 0;

    // Usar getUTCDate() para evitar que o fuso horário local (ex: GMT-3)
    // transforme o início do dia em 21:00 do dia anterior.
    return date.getUTCDate();
  }

  getTransacoesDoDia(dia: number): TransacaoModel[] {
    return this.transacoesPorDia[dia] || [];
  }

  getSomaSaidasDoDia(dia: number): number {
    return this.getTransacoesDoDia(dia)
      .filter(t => t.tipo?.toLowerCase() === 'saida')
      .reduce((acc, t) => acc + parseFloat(t.valor.toString()), 0);
  }

  getSomaEntradasDoDia(dia: number): number {
    return this.getTransacoesDoDia(dia)
      .filter(t => t.tipo?.toLowerCase() === 'entrada')
      .reduce((acc, t) => acc + parseFloat(t.valor.toString()), 0);
  }
}
