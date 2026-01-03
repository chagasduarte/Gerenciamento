import {
  Component,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ViewChild,
  OnInit,
  ElementRef,
  Input
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { combineLatest, forkJoin } from 'rxjs';
import { SystemService } from '../../../services/system.service';
import { TransacoesService } from '../../../services/transacoes.service';


@Component({
  selector: 'app-evolucao',
  imports: [],
  templateUrl: './evolucao.component.html',
  styleUrls: [
    './evolucao.component.css',
    './evolucao.component.mobile.css'
  ]
})
export class EvolucaoComponent  implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('chartDiv', { static: true }) chartDiv!: ElementRef<HTMLDivElement>;
  @Input() intervalo: number = 12;
  dados: {
    coluna: string;
    entradas: number;
    saidas: number;
    progressao: number;
  }[] = [];
  

  private root!: am5.Root;

  constructor(        
    public readonly systemService: SystemService,
    private readonly transacoesService: TransacoesService,
    @Inject(PLATFORM_ID) private platformId: object
  ){
  }

  ngOnDestroy(): void {
    if (this.root) {
      this.root.dispose();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // this.criarGrafico();
    }
  }

  ngOnInit(): void {
    combineLatest([
        this.systemService.ano$,
        this.systemService.mes$
    ]).subscribe(([ano, mes]) => {
        forkJoin([
            this.transacoesService.GetProjecao(ano.valor)
        ]).subscribe({
            next: (success) => {
                
                const mesAtual = mes.valor + 1;
                const metade = Math.floor(this.intervalo / 2);
                const mesInicial = mesAtual - metade;
                const mesFinal = mesAtual + metade;

                const meses = success[0]
                .filter(x => x.mes >= mesInicial && x.mes <= mesFinal)
                .sort((a, b) => a.mes - b.mes);
                
                this.dados = meses.map(p => (
                {
                  coluna: this.getNameMes(parseInt(p.mes.toString())),
                  entradas: parseFloat(p.soma_entrada.toString()),
                  saidas: parseFloat(p.soma_saida.toString()),
                  progressao: parseFloat(p.saldo_acumulado.toString())
                }))

                this.criarGrafico();
            }
        });
    });
  }

  private criarGrafico(): void {
    if (this.root) {
      this.root.dispose(); // 🔥 remove gráfico antigo
    }
    // 1️⃣ Root
    this.root = am5.Root.new(this.chartDiv.nativeElement);
    /* REMOVE O LOGO DO AMCHARTS */
    (this.root as any)._logo?.dispose();
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    // 2️⃣ Chart
    const chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        layout: this.root.verticalLayout,
        panX: false,
        panY: false
      })
    );
    
    // 3️⃣ Eixo X (MÊS)
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: 'coluna',
        renderer: am5xy.AxisRendererX.new(this.root, {
          minGridDistance: 30
        })
      })
    );
    xAxis.data.setAll(this.dados);

    // 4️⃣ Eixo Y (VALORES)
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {strokeOpacity: 0.1})
      })
    );

    // 5️⃣ Série ENTRADAS
    const entradasSeries = chart.series.push(
      am5xy.ColumnSeries.new(this.root, {
        name: 'Entradas',
        xAxis,
        yAxis,
        valueYField: 'entradas',
        sequencedInterpolation: true,
        categoryXField: 'coluna',
        tooltip: am5.Tooltip.new(this.root, {
          labelText: "{valueY}"
        })
      })
    );
    entradasSeries.columns.template.setAll({cornerRadiusTL: 6, cornerRadiusTR: 6, strokeOpacity: 0 })
  
    entradasSeries.data.setAll(this.dados);
    // 6️⃣ Série SAÍDAS
    const saidasSeries = chart.series.push(
      am5xy.ColumnSeries.new(this.root, {
        name: 'Saídas',
        xAxis,
        yAxis,
        valueYField: 'saidas',
        categoryXField: 'coluna',
        tooltip: am5.Tooltip.new(this.root, {
          labelText: "{valueY}"
        })
      })
    );
    saidasSeries.columns.template.setAll({cornerRadiusTL: 6, cornerRadiusTR: 6, strokeOpacity: 0 })
    saidasSeries.data.setAll(this.dados);

    const progressaoLine = chart.series.push(
      am5xy.LineSeries.new(this.root, {
        name: 'Progressao',
        minBulletDistance: 10,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "progressao",
        categoryXField: 'coluna',
        tooltip: am5.Tooltip.new(this.root, {
          pointerOrientation: "horizontal",
          labelText: "{valueY}"
        })
      })
    );
    progressaoLine.strokes.template.setAll({
      strokeWidth: 3
    });
    progressaoLine.data.setAll(this.dados);
    progressaoLine.bullets.push( () => {
      return am5.Bullet.new(this.root, {
        sprite: am5.Circle.new(this.root, {
          radius: 6,
          fill: progressaoLine.get("fill"),
          stroke: this.root.interfaceColors.get("background"),
          strokeWidth: 2
        })
      });
    });

    // 7️⃣ Legenda
    const legend = chart.children.push(
      am5.Legend.new(this.root, {
        centerX: am5.p50,
        x: am5.p50
      })
    );

    legend.data.setAll(chart.series.values);

    // 8️⃣ Animação inicial
    chart.appear(1000, 100);
  }

  getNameMes(mes: number): string{
    switch (mes) {
      case 1:
        return "Jan";
      case 2:
        return "Fev";
      case 3:
        return "Mar";
      case 4:
        return "Abr";
      case 5:
        return "Mai";
      case 6:
        return "Jun";
      case 7:
        return "Jul";
      case 8:
        return "Ago";
      case 9:
        return "Set";
      case 10:
        return "Out";
      case 11: 
        return "Nov";
      case 12:
        return "Dez";
      default:
        return "";
    }
  }

}
