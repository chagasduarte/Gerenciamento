import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Planejamento } from '../../../shared/models/planejamento';
import { PlanejamentoService } from '../../../shared/services/planejamento.service';
import { SystemService } from '../../../shared/services/system.service';
import { combineLatest, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PlanoFormComponent } from "../../../shared/components/plano-form/plano-form.component";
import { SumPlanosPipe } from '../../../shared/pipes/sum-planos.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransacoesService } from '../../../shared/services/transacoes.service';
import { agruparPorCategoria } from '../../../utils/functions/agruparPorCategoria';
import { AgrupamentoResponse } from '../../../shared/models/agrupamento';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

@Component({
  selector: 'app-planos',
  imports: [PlanoFormComponent, CommonModule, FormsModule, SumPlanosPipe],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.css'
})
export class PlanosComponent implements OnInit {
  @ViewChild('chartDiv') chartDiv!: ElementRef<HTMLDivElement>;

  planos: Planejamento[] = [];
  planosAgrupados: { categoria: string, itens: Planejamento[], categoriaId?: number }[] = [];
  mostrarFormulario = false;
  planoSelecionado?: Planejamento;

  tabAtiva: 'lista' | 'grafico' = 'lista';
  agrupamentoSaidas!: AgrupamentoResponse;
  agrupamentoCategoria: any;
  private root!: am5.Root;

  constructor(
    private planosService: PlanejamentoService,
    private systemService: SystemService,
    private transacoesService: TransacoesService,
    private readonly toast: ToastrService
  ) { }


  ngOnInit(): void {
    this.carregarPlanos();
  }


  carregarPlanos() {
    combineLatest([
      this.systemService.ano$,
      this.systemService.mes$
    ]).subscribe(([ano, mes]) => {
      forkJoin([
        this.planosService.listar(mes.valor + 1, ano.valor),
        this.transacoesService.GetAgrupamento(mes.valor + 1, ano.valor, 'saida')
      ]).subscribe({
        next: ([planos, agrupamento]) => {
          this.planos = planos;
          this.agrupamentoSaidas = agrupamento;
          this.agrupamentoCategoria = agruparPorCategoria(this.agrupamentoSaidas);
          this.agruparPlanos();
          if (this.tabAtiva === 'grafico') {
            setTimeout(() => this.createChart(), 100);
          }
        },
        error: (err) => {
          console.error(err);
          this.toast.error(err.message);
        }
      });
    });
  }


  agruparPlanos() {
    const grupos: { [key: string]: Planejamento[] } = {};
    const gruposId: { [key: string]: number } = {};

    this.planos.forEach((p: Planejamento) => {
      if (!grupos[p.categoria]) {
        grupos[p.categoria] = [];
        gruposId[p.categoria] = p.categoriaid;
      }
      grupos[p.categoria].push(p);
    });
    this.planosAgrupados = Object.keys(grupos).map(categoria => ({
      categoria,
      categoriaId: gruposId[categoria],
      itens: grupos[categoria]
    }));
  }


  atualizarValor(plano: Planejamento) {
    if (plano.id) {
      this.planosService.atualizar(plano.id, plano).subscribe({
        next: () => {
          this.toast.success('Valor atualizado com sucesso');
          this.carregarPlanos();
        },
        error: (err) => {
          this.toast.error('Erro ao atualizar valor');
        }
      });
    }
  }


  excluirSubcategoria(id: number) {
    if (confirm('Deseja excluir esta subcategoria?')) {
      this.planosService.deletar(id).subscribe({
        next: () => {
          this.toast.success('Subcategoria excluída');
          this.carregarPlanos();
        },
        error: (err) => {
          this.toast.error('Erro ao excluir subcategoria');
        }
      });
    }
  }


  novoPlano() {
    this.planoSelecionado = undefined;
    this.mostrarFormulario = true;
  }


  editar(plano: Planejamento) {
    this.planoSelecionado = plano;
    this.mostrarFormulario = true;
  }


  excluir(id: number) {
    if (confirm('Deseja excluir este plano?')) {
      this.planosService.deletar(id).subscribe(() => this.carregarPlanos());
    }
  }


  fecharFormulario() {
    this.mostrarFormulario = false;
    this.carregarPlanos();
  }

  selecionarTab(tab: 'lista' | 'grafico') {
    this.tabAtiva = tab;
    if (tab === 'grafico') {
      setTimeout(() => this.createChart(), 100);
    }
  }

  private createChart() {
    if (this.root) {
      this.root.dispose();
    }
    if (!this.chartDiv) return;

    this.root = am5.Root.new(this.chartDiv.nativeElement);
    (this.root as any)._logo?.dispose();
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    let chart = this.root.container.children.push(
      am5xy.XYChart.new(this.root, {
        panX: true,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: this.root.verticalLayout
      })
    );

    // Dados
    let data = this.planosAgrupados.map(grupo => {
      const totalPlanejado = grupo.itens.reduce((acc, curr) => acc + curr.valor, 0);
      const totalExecutado = this.agrupamentoCategoria[grupo.categoriaId!]?.soma ?? 0;
      return {
        categoria: grupo.categoria,
        planejado: totalPlanejado,
        executado: totalExecutado
      };
    });

    // Eixos
    let xRenderer = am5xy.AxisRendererX.new(this.root, {
      minGridDistance: 30,
      cellStartLocation: 0.1,
      cellEndLocation: 0.9
    });
    xRenderer.labels.template.setAll({
      rotation: -45,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15,
      fill: am5.color(0xd1e8ec)
    });

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.root, {
        categoryField: "categoria",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(this.root, {})
      })
    );
    xAxis.data.setAll(data);

    let yRenderer = am5xy.AxisRendererY.new(this.root, {});
    yRenderer.labels.template.setAll({
      fill: am5.color(0xd1e8ec)
    });

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: yRenderer
      })
    );

    // Séries
    // Planejado
    let series1 = chart.series.push(
      am5xy.ColumnSeries.new(this.root, {
        name: "Planejado",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "planejado",
        categoryXField: "categoria",
        tooltip: am5.Tooltip.new(this.root, {
          labelText: "{name}: {valueY}"
        })
      })
    );
    series1.columns.template.setAll({
      width: am5.percent(40), // Largura menor para caber duas
      tooltipY: 0,
      fill: am5.color(0x0f766e), // Cor do tema
      strokeOpacity: 0
    });
    series1.data.setAll(data);

    // Executado
    let series2 = chart.series.push(
      am5xy.ColumnSeries.new(this.root, {
        name: "Executado",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "executado",
        categoryXField: "categoria",
        tooltip: am5.Tooltip.new(this.root, {
          labelText: "{name}: {valueY}"
        })
      })
    );
    series2.columns.template.setAll({
      width: am5.percent(40),
      tooltipY: 0,
      fill: am5.color(0xef4444), // Vermelho para gastos
      strokeOpacity: 0,
    });
    series2.data.setAll(data);

    // Legenda
    let legend = chart.children.push(am5.Legend.new(this.root, {
      centerX: am5.p50,
      x: am5.p50
    }));
    legend.labels.template.setAll({
      fill: am5.color(0xd1e8ec)
    });
    legend.data.setAll(chart.series.values);

    chart.appear(1000, 100);
  }

  ngOnDestroy() {
    if (this.root) {
      this.root.dispose();
    }
  }
}