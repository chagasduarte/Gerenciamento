import { Component, Inject, OnInit, PLATFORM_ID, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { SystemService } from '../../../services/system.service';
import { TransacoesService } from '../../../services/transacoes.service';
import { combineLatest } from 'rxjs';
import { TipoDespesa } from '../../../models/tipoDespesa';
import { CategoriaService } from '../../../services/categoria.service';
import { Categoria } from '../../../models/categoria.model';
import { Subcategoria } from '../../../models/subcategoria.model';
import { SubcategoriaService } from '../../../services/subcategoria.service';

@Component({
    selector: 'app-categorias-chart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './categorias.component.html',
    styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('chartDiv', { static: true }) chartDiv!: ElementRef<HTMLDivElement>;
    private root!: am5.Root;
    subcategorias!: Subcategoria[]
    constructor(
        private systemService: SystemService,
        private transacoesService: TransacoesService,
        private categoriaService: SubcategoriaService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            combineLatest([
                this.systemService.ano$
            ]).subscribe(([ano]) => {
                this.categoriaService.listarAll().subscribe(x => {
                    this.subcategorias = x;

                    this.transacoesService.GetGraficosPizza(ano.valor).subscribe(dados => {
                        this.createChart(dados);
                    });
                });
            });
        }
    }

    ngAfterViewInit(): void { }

    ngOnDestroy(): void {
        if (this.root) {
            this.root.dispose();
        }
    }

    createChart(dados: any[]) {
        if (this.root) {
            this.root.dispose();
        }

        let root = am5.Root.new(this.chartDiv.nativeElement);
        root.setThemes([am5themes_Animated.new(root)]);
        (root as any)._logo?.dispose();

        let chart = root.container.children.push(
            am5percent.PieChart.new(root, {
                layout: root.verticalLayout,
                innerRadius: am5.percent(50)
            })
        );

        let series = chart.series.push(
            am5percent.PieSeries.new(root, {
                valueField: "media_mensal",
                categoryField: "nomeCategoria",
                alignLabels: false
            })
        );

        series.labels.template.setAll({
            textType: "circular",
            centerX: 0,
            centerY: 0
        });

        // Map TipoDespesa enum to string name
        const dataWithNames = dados.map(item => ({
            ...item,
            nomeCategoria: this.subcategorias.find(x => x.id == parseInt(item.categoria?.toString()))?.nome
        }));

        series.data.setAll(dataWithNames);

        let legend = chart.children.push(am5.Legend.new(root, {
            centerX: am5.percent(50),
            x: am5.percent(50),
            marginTop: 15,
            marginBottom: 15
        }));

        legend.data.setAll(series.dataItems);

        series.appear(1000, 100);
        this.root = root;
    }
}
