

import { AfterViewInit, Component, NgZone, OnDestroy } from '@angular/core';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

@Component({
  selector: 'app-progressao',
  imports: [],
  templateUrl: './progressao.component.html',
  styleUrl: './progressao.component.css'
})

export class ProgressaoComponent implements AfterViewInit, OnDestroy {
  private root!: am5.Root;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      // 1️⃣ Criar o root do gráfico
      this.root = am5.Root.new("barChartDiv");

      // 2️⃣ Adicionar tema (opcional)
      this.root.setThemes([
        am5themes_Animated.new(this.root)
      ]);

      // 3️⃣ Criar um gráfico de XY (colunas)
      const chart = this.root.container.children.push(
        am5xy.XYChart.new(this.root, { panX: true, panY: true })
      );
      const xRenderer = am5xy.AxisRendererX.new(this.root, {
        minGridDistance: 30
      });
      // 4️⃣ Eixos
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(this.root, {
          categoryField: "category",
          renderer: xRenderer
        })
      );
      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(this.root, { renderer: am5xy.AxisRendererY.new(this.root, {}) })
      );

      xAxis.data.setAll([
        { category: "A" },
        { category: "B" },
        { category: "C" }
      ]);

      // 5️⃣ Série de colunas
      const series = chart.series.push(
        am5xy.ColumnSeries.new(this.root, {
          name: "Series",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          categoryXField: "category"
        })
      );

      series.data.setAll([
        { category: "A", value: 40 },
        { category: "B", value: 55 },
        { category: "C", value: 70 }
      ]);
    });
  }

  ngOnDestroy(): void {
    if (this.root) {
      this.root.dispose(); // libera memória
    }
  }
}
