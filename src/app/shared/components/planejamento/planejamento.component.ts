import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';
import { PlanejamentoAgrupadoTipo } from '../../models/planejamentoagrupado';
import { PlanejamentoCompComponent } from "../charts/planejamento-comp/planejamento-comp.component";
import { ModalNovoPlanejamentoComponent } from "../modal-novo-planejamento/modal-novo-planejamento.component";
import { PlanejamentoService } from '../../services/planejamento.service';
import { SystemService } from '../../services/system.service';
import { ResumoMensal } from '../../models/resumo.model';
import { TransacoesService } from '../../services/transacoes.service';
import { AgrupamentoResponse } from '../../models/agrupamento';
import { combineLatest, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Planejamento } from '../../models/planejamento';
import { agruparPorCategoria } from '../../../utils/functions/agruparPorCategoria';

import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { number } from 'echarts';
import { ResumoComponent } from "../charts/resumo/resumo.component";
import { SubcategoriaService } from '../../services/subcategoria.service';
import { Subcategoria } from '../../models/subcategoria.model';


interface AgrupadoPorCategoriaMap {
  [categoria: number]: {
    categoria: number;
    total_tipo: number;
  };
}

interface PieData {
  categoria: string;
  total_tipo: number;
}
 

@Component({
  selector: 'app-planejamento',
  imports: [
    CommonModule,
    PlanejamentoCompComponent,
    ModalNovoPlanejamentoComponent,
],
  templateUrl: './planejamento.component.html',
  styleUrls: [
    './planejamento.component.css',
    './planejamento.component.mobile.css',
  ]
})
export class PlanejamentoComponent implements OnInit{
  @ViewChild('chartDiv', { static: true }) chartDiv!: ElementRef<HTMLDivElement>;

  tipo: string = "Saídas";
  planejados: number = 0;
  valor: number = 0;
  percent: number = 0;
  abaAtiva: 'entradas' | 'saidas' = 'saidas';
  planejamentos: PlanejamentoAgrupadoTipo[] = [];
  resumoMensal$ = this.systemService.resumo$; // <-- agora é reativo
  resumoMensal!: ResumoMensal;
  agrupamentoSaidas!: AgrupamentoResponse;
  agrupamentoEntradas!: AgrupamentoResponse;
  agrupamentoCategoria: any;
  private root!: am5.Root;
  private labels: am5.Label[] = [];
  categorias!: Categoria[];
  subcategorias!: Subcategoria[];

  constructor(
    private readonly planejamentoService: PlanejamentoService,
    private readonly systemService: SystemService,
    private readonly transacoesService: TransacoesService,
    private readonly toast: ToastrService,
    private readonly categoriaService: CategoriaService,
    private readonly subcategoriaService: SubcategoriaService,
  ){}

  ngOnInit(): void {
    this.requisicoesApi()
  }
  requisicoesApi(){
    combineLatest([
        this.systemService.ano$,
        this.systemService.mes$
    ]).subscribe(([ano, mes]) => {
        forkJoin([
            this.planejamentoService.listarAgrupado(mes.valor + 1, ano.valor),
            this.transacoesService.GetAgrupamento(mes.valor + 1, ano.valor, 'saida'),
            this.transacoesService.GetAgrupamento(mes.valor + 1, ano.valor, 'entrada'),
            this.categoriaService.listar(),
            this.subcategoriaService.listarAll()
          ]).subscribe({
          next: (success) => {
            this.planejamentos = success[0];
            this.planejados = this.planejamentos.find(x => x.tipo == this.abaAtiva)?.soma!??0;
            this.agrupamentoSaidas = success[1];
            this.agrupamentoEntradas = success[2];
            this.valor = this.agrupamentoSaidas.soma.soma??0;
            this.agrupamentoCategoria = agruparPorCategoria(this.agrupamentoSaidas);
            this.categorias = success[3];
            this.subcategorias = success[4];
            this.createChart(this.agrupamentoSaidas);
          },
          error: (err) => {
            console.error(err);
            this.toast.error(err.message);
          } 
        })
    });
  }


  selecionar(tab: 'entradas' | 'saidas') {
    this.abaAtiva = tab;
    this.tipo = tab == 'entradas'? 'Entradas' : 'Saídas';
    this.agrupamentoCategoria = agruparPorCategoria(tab == 'entradas'? this.agrupamentoEntradas : this.agrupamentoSaidas);

    this.planejados = this.planejamentos.find(x => x.tipo == tab)?.soma!;
    this.valor = this.abaAtiva == 'entradas'?  this.agrupamentoEntradas?.soma.soma??0 : this.agrupamentoSaidas?.soma.soma??0 
    this.createChart(this.abaAtiva == 'entradas'?  this.agrupamentoEntradas : this.agrupamentoSaidas );

  }

  private createChart(dados: AgrupamentoResponse): void {
    try {
    if (this.root) {
      this.root.dispose(); // 🔥 remove gráfico antigo
    }

    // Root
    this.root = am5.Root.new(this.chartDiv.nativeElement);
    /* REMOVE O LOGO DO AMCHARTS */
    (this.root as any)._logo?.dispose();
    // Theme
    this.root.setThemes([
      am5themes_Animated.new(this.root)
    ]);

    // Chart
    const chart = this.root.container.children.push(
      am5percent.PieChart.new(this.root, {
        layout: this.root.verticalLayout,
        innerRadius: am5.percent(50)
      })
    );

    // Series
    const series = chart.series.push(
      am5percent.PieSeries.new(this.root, {
        valueField: "total_tipo",
        categoryField: "categoria"
      })
    );
    let array: { categoria: string; total_tipo: number; }[];

    if(dados.agrupamento.length > 0) {
      array = dados.agrupamento.map(x => ({
        categoria: this.categoriaNome(x.categoria),
        total_tipo: Number(x.total_tipo)
      }));
    }
    // Data
    series.data.setAll(array!);
    series.labels.template.setAll({
      fontSize: '12px'
    });
    // Animation
    series.appear(1000, 100);
    }
    catch (err) {
      console.error(err);
    }
  }

  categoriaNome(id: number): string {
    return this.subcategorias.find(x => x.id == id)?.nome!.substring(0, 3) || "";
  }

  categoriaCor(id: number): string {
    return this.categorias.find(x => x.id == id)?.cor! || "";
  }
  
}
