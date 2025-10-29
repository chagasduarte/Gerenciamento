import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SystemService } from "../../shared/services/system.service";
import { TipoDespesaGrafico } from "../../shared/models/graficos";
import { Router } from "@angular/router";
import { Ano } from "../../utils/meses";
import { combineLatest, forkJoin } from "rxjs";
import { drawProjecoes } from "./drawcharts/progressao.coloumn";
import { drawCategoriaPie } from "./drawcharts/categorias.pie";
import { drawMediasBar } from "./drawcharts/medias.bar";
import { Projecao } from "../../shared/models/projecao.model";
import { TransacoesService } from "../../shared/services/transacoes.service";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
      CommonModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements  OnInit {
    tipoDespesaAgrupada: TipoDespesaGrafico[] = [];
    anosDeDivida: number[] = [2024, 2025, 2026, 2027];
    projecoes!: Projecao[]; 
    recomendados = [
            {categoria: 1, media_mensal: 12} as TipoDespesaGrafico,
            {categoria: 2, media_mensal: 10} as TipoDespesaGrafico,
            {categoria: 3, media_mensal: 7} as TipoDespesaGrafico,
            {categoria: 4, media_mensal: 5} as TipoDespesaGrafico,
            {categoria: 5, media_mensal: 6} as TipoDespesaGrafico,
            {categoria: 6, media_mensal: 28} as TipoDespesaGrafico,
            {categoria: 7, media_mensal: 7} as TipoDespesaGrafico,
            {categoria: 9, media_mensal: 25} as TipoDespesaGrafico
        ];

    constructor(
        public systemService: SystemService,
        private readonly router: Router,
        private readonly transacoesService: TransacoesService
    ){
    }
    ngOnInit(): void {
        this.buscaDados();
    }

    buscaDados(){
        combineLatest([
            this.systemService.ano$,
            this.systemService.mes$
        ]).subscribe(([ano, mes]) => {
            forkJoin([
                this.transacoesService.GetProjecao(ano.valor),
                this.transacoesService.GetGraficosPizza(ano.valor)
            ]).subscribe({
                next: (success) => {
                    this.projecoes = success[0];
                    this.tipoDespesaAgrupada = success[1];
                    this.loadGoogleCharts();
                }
            });
        });
    }

    voltar(){
        this.router.navigate(['home'])
    }
    mudaAno(ano: number){
        this.systemService.setAno(new Ano(ano));
        this.buscaDados();
    }

    loadGoogleCharts() {
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.onload = () => {
            drawCategoriaPie(this.tipoDespesaAgrupada, 'pizza');
            drawCategoriaPie(this.recomendados, 'pizza2');
            drawProjecoes(this.projecoes);
            drawMediasBar(this.tipoDespesaAgrupada, this.systemService.ano);
        };
        document.body.appendChild(script);
    }
}