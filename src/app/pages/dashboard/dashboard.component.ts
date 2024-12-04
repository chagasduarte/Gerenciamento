import { Component, OnInit } from "@angular/core";
import { NgxEchartsDirective } from "ngx-echarts";
import { NgxSpinnerComponent } from "ngx-spinner";
import { GastosComponent } from "../gastos/gastos.component";
import { CommonModule } from "@angular/common";
import { SystemService } from "../../shared/services/system.service";
import { MesGrafico, TipoDespesaGrafico } from "../../shared/models/graficos";
import { DefineCor } from "../../utils/functions/defineCorGrafico";
import { GraficoService } from "../../shared/services/graficos.service";
import { Router } from "@angular/router";
import { Ano, Mes } from "../../utils/meses";
import { Despesa } from "../../shared/models/despesa";
import { DespesasService } from "../../shared/services/despesas.service";
import { ContasService } from "../../shared/services/contas.service";
import { TipoDespesa } from "../../shared/models/tipoDespesa";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
      CommonModule,
      GastosComponent,
      NgxEchartsDirective,
      NgxSpinnerComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements  OnInit {
    contemMenorQZero: boolean = true;
    graficos!: MesGrafico[];
    despesas: Despesa[] = [];
    tipoDespesaAgrupada: TipoDespesaGrafico[] = [];
    anosDeDivida: number[] = [2024, 2025, 2026];

    constructor(
        public systemService: SystemService,
        private readonly graficosService: GraficoService,
        private readonly router: Router,
        private readonly despesasService: DespesasService,
        private readonly contasService: ContasService
    ){
    }
    ngOnInit(): void {
        this.buscaDados();
        
    }

    buscaDados(){
        this.graficosService.GetGraficos(this.systemService.ano.valor).subscribe(x => {
            this.graficos = x
            this.loadGoogleCharts()
        });
        this.despesasService.GetDespesasAdicionais(this.systemService.ano.valor).subscribe({
            next: (despesas: Despesa[]) => {
                this.despesas = despesas;
                this.agruparDespesas()
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
          this.tipoDespesaAgrupada[despesa.TipoDespesa].saida += parseFloat(despesa.ValorTotal.toString());
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
          this.drawChartInOut();
          this.drawChart();
          this.drawChartPizza();
          this.drawChartProg();
        };
        document.body.appendChild(script);
    }
    drawChartPizza(){
        const google = (window as any).google;
        google.charts.load('current', {'packages': ['corechart']});
        google.charts.setOnLoadCallback(() => {
            const data = google.visualization.arrayToDataTable(this.despesaAgrupadaToArray());
            var options = {
                title: 'Categoria',
                backgroundColor: {fill: "none"},
                is3D: true
            };
            var chart = new google.visualization.PieChart(document.getElementById('pizza'));

            chart.draw(data, options);
        })
    }

    despesaAgrupadaToArray(): (string | number)[][] {
        let dados: (string | number)[][] = [];
        dados.push(['Categoria', 'Valor']);
        for(const tipo in  TipoDespesa) {
            if(!isNaN(Number(tipo))) {
                const valor = this.tipoDespesaAgrupada.find(x => x.TipoDespesa == Number(tipo))?.saida || 0;
                dados.push([TipoDespesa[tipo], valor])
            }
        }
        return dados;
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

    drawChartProg(){
        const google = (window as any).google;
        google.charts.load('current', {'packages': ['bar']});
        google.charts.setOnLoadCallback(() => {
            const data = google.visualization.arrayToDataTable(this.progrecao());
            var options = {
                title: 'Progressão',
                backgroundColor: {fill: "none"},
                bars: 'vertical', // Required for Material Bar Charts.
                hAxis: {format: 'decimal'},
                colors: ['#1b9e77', '#d95f02'],
                legend: { position: 'none' }
            };
            var chart = new google.visualization.BarChart(document.getElementById('progressao'));

            chart.draw(data, options);
        })
    }
    progrecao(): (string | number)[][] {
        let dados: (string | number)[][] = [];
        dados.push(['Mês', 'Progressao']);
        
        for(const mes of this.graficos){
            dados.push([mes.nomeabrev, parseFloat(mes.progressao.toString())]);
        }
        
        return dados;
    }
    drawChart() {
        // Carregar o pacote de gráficos
        const google = (window as any).google;
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(() => {
            const data = google.visualization.arrayToDataTable([
            ['Mês', 'Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Moradia', 'Serviços', 'Outros' ],
            ['Janeiro', 300, 200, 150, 250, 50,50,50,50],
            ['Fevereiro', 400, 250, 100, 300, 50,50,50,50],
            ['Março', 350, 300, 200, 220, 50,50,50,50],
            ['Abril', 450, 320, 180, 350, 50,50,50,50],
            ['Maio', 400, 250, 220, 300, 50,50,50,50],
            ['Junho', 500, 400, 300, 400, 50,50,50,50]
            ]);

            const options = {
                title: 'Gastos Mensais por Tipo',
                curveType: 'function',
                legend: { position: 'bottom' },
                hAxis: { title: 'Mês' },
                vAxis: { title: 'Gastos (R$)' },
                colors: ['#e2431e', '#f1ca3a', '#6f9654', '#1c91c0'],
                backgroundColor: {fill: "none"}
            };

            const chart = new google.visualization.LineChart(document.getElementById('grafico_linha'));
            chart.draw(data, options);
        });
    }
    
}