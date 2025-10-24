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
        //   this.drawChartInOut();
        //   this.drawChart();
            drawCategoriaPie(this.tipoDespesaAgrupada);
            drawProjecoes(this.projecoes);
            drawMediasBar(this.tipoDespesaAgrupada, this.systemService.ano);
        };
        document.body.appendChild(script);
    }
}