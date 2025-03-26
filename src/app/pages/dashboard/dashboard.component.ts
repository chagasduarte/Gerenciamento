import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SystemService } from "../../shared/services/system.service";
import { MesGrafico, TipoDespesaGrafico } from "../../shared/models/graficos";
import { GraficoService } from "../../shared/services/graficos.service";
import { Router } from "@angular/router";
import { Ano, Mes } from "../../utils/meses";
import { Despesa } from "../../shared/models/despesa";
import { DespesasService } from "../../shared/services/despesas.service";
import { ContasService } from "../../shared/services/contas.service";
import { TipoDespesa } from "../../shared/models/tipoDespesa";
import { LogMensalService } from "../../shared/services/log-mensal.service";
import { LogMensal } from "../../shared/models/logMensal";
import { forkJoin } from "rxjs";
import { drawSaidas } from "./drawcharts/progressao.coloumn";
import { drawCategoriaPie } from "./drawcharts/categorias.pie";
import { drawMediasBar } from "./drawcharts/medias.bar";
import { Parcela } from "../../shared/models/parcela";
import { ParcelasService } from "../../shared/services/parcelas.service";

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
    contemMenorQZero: boolean = true;
    graficos!: MesGrafico[];
    despesas: Despesa[] = [];
    parcelas: Parcela[] = [];
    tipoDespesaAgrupada: TipoDespesaGrafico[] = [];
    anosDeDivida: number[] = [2024, 2025, 2026];
    logs: LogMensal[] = [];

    constructor(
        public systemService: SystemService,
        private readonly graficosService: GraficoService,
        private readonly router: Router,
        private readonly despesasService: DespesasService,
        private readonly contasService: ContasService,
        private readonly logsService: LogMensalService,
        private readonly parcelasService: ParcelasService
    ){
    }
    ngOnInit(): void {
        this.buscaDados();
        
    }

    buscaDados(){
         forkJoin([
            this.graficosService.GetGraficos(this.systemService.ano.valor),
            this.despesasService.GetDespesasAdicionais(this.systemService.ano.valor),
            this.logsService.getAllLogs(this.systemService.ano.valor),
            this.parcelasService.GetParcelasByAno(this.systemService.ano.valor)
        ]).subscribe({
            next: (success) => {
                this.graficos = success[0];
                this.despesas = success[1];
                this.logs = success[2];
                this.parcelas = success[3];

                this.agruparDespesas();
                this.loadGoogleCharts();
            }
        });
        
    }

    agruparDespesas(){
        this.tipoDespesaAgrupada = [];
        this.tipoDespesaAgrupada.push( {id: Number(0), TipoDespesa: Number(0), saida: 0})
        for (const tipo in  TipoDespesa){
            if(!isNaN(Number(tipo))) {
                this.tipoDespesaAgrupada.push( {id: Number(tipo), TipoDespesa: Number(tipo), saida: 0})
            }
        }
        for (let despesa of this.despesas){
          this.tipoDespesaAgrupada.map(x => { 
            if (x.TipoDespesa == despesa.TipoDespesa ) {
                x.saida += parseFloat(despesa.ValorTotal.toString())
            }
          });
        }
        for( let parcela of this.parcelas){
            this.tipoDespesaAgrupada.map(x => {
                if (x.TipoDespesa == parcela.TipoDespesa){
                    x.saida += parseFloat(parcela.Valor.toString());
                }
            })
        }
    }

    voltar(){
        this.router.navigate(['home'])
    }
    mudaAno(ano: number){
        this.systemService.ano = new Ano(ano);
        this.buscaDados();
    }

    loadGoogleCharts() {
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/charts/loader.js';
        script.onload = () => {
        //   this.drawChartInOut();
        //   this.drawChart();
            drawCategoriaPie(this.tipoDespesaAgrupada);
            drawSaidas(this.graficos);
            drawMediasBar(this.tipoDespesaAgrupada, this.systemService.ano);
        };
        document.body.appendChild(script);
    }
    
    drawChartInOut(){
        const google = (window as any).google;
        google.charts.load('current', {'packages': ['corechart', 'bar']});
        google.charts.setOnLoadCallback(() => {
            const data = google.visualization.arrayToDataTable(this.arrayInOut());
            var options = {
                title: 'Entradas e Saidas',
                backgroundColor: { fill: 'none' },  // Cor de fundo do gráfico            
                bars: 'horizontal', // Required for Material Bar Charts.
                hAxis: {format: 'decimal'},
                colors: ['#1b9e77', '#d95f02'],
                legend: { position: 'none' }
            };
            var chart = new google.visualization.BarChart(document.getElementById('entradas_saidas'));

            chart.draw(data, options);
        })
    }
    arrayInOut(): (string | number)[][] {
        let dados: (string | number)[][] = [];
        dados.push(['Mês', 'Entradas', 'Saidas']);
        for(const mes of this.graficos){
            dados.push([mes.nomeabrev, parseFloat(mes.entrada.toString()), parseFloat(mes.saida.toString())]);
        }
        return dados;
    }

    
}