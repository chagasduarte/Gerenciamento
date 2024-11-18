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
        for (const tipo in  TipoDespesa){
            if(!isNaN(Number(tipo))) {
                this.tipoDespesaAgrupada.push( {id: Number(tipo), TipoDespesa: Number(tipo), saida: 0})
            }
        }
        for (let despesa of this.despesas){
            try {
                this.tipoDespesaAgrupada[despesa.TipoDespesa -1].saida += parseFloat(despesa.ValorTotal.toString());
            }
            catch {
                console.log(despesa);
            }
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
          this.drawChartLine();
          this.drawChartPizza();
          this.drawChartProg();
        };
        document.body.appendChild(script);
    }
    drawChartPizza(){
        const google = (window as any).google;
        google.charts.load('current', {packages: ["corechart", "bar"]});
        google.charts.setOnLoadCallback(() => {
            const data = google.visualization.arrayToDataTable(this.despesaAgrupadaToArray());
            var options = {
                title: 'Categoria',
                is3D: true,
                backgroundColor: {fill: 'none'},
                width: 1300,
                height: 600
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
        google.charts.load('current', {packages: ["corechart", "bar"]});
        google.charts.setOnLoadCallback(() => {
            const data = google.visualization.arrayToDataTable(this.arrayInOut());
            var options = {
                title: 'Entradas e Saidas',
                orientation: 'horizontal',
                colors: ['#1b9e77', '#d95f02'],
                legend: { position: 'none' },
                backgroundColor: {fill: 'none'},
                width: 1300,
                height: 600

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
        google.charts.load("current", { packages: ["corechart", "bar"] })
        google.charts.setOnLoadCallback(() => {
            var data = google.visualization.arrayToDataTable(this.progrecao());
            var options = {
                title: 'Progressão',
                orientation: 'horizontal',
                colors: ['#1b9e77'],
                legend: { position: 'none' },
                backgroundColor: {fill: 'none'},
                width: 1300,
                height: 600
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
    drawChartLine() {
        // Carregar o pacote de gráficos
        const google = (window as any).google;
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(() => {
            const data = google.visualization.arrayToDataTable(this.graficoLinhasToArray());

            const options = {
                title: 'Gastos Mensais por Tipo',
                backgroundColor: {fill: 'none'},
                width: 1300,
                height: 600
            };

            const chart = new google.visualization.LineChart(document.getElementById('grafico_linha'));
            chart.draw(data, options);
        });
    }
    graficoLinhasToArray(): (string | number)[][] {
        let dados: (string | number)[][] = [];
        dados.push(['Mês', 'Alimentação', 'Transporte', 'Saúde', 'Educação', 'Lazer', 'Moradia', 'Serviços', 'Outros' ]);
        dados.push(['Jan', 50,            80,            90,      64,         96,      35,         82,       56]);
        dados.push(['Fev', 70,            100,            80,     61,         80,      125,         62.35,   106]);
        dados.push(['Mar', 40,            10,            35,     81,         95,      106,         42,   95]);
        dados.push(['Abr', 40,            10,            35,     81,         95,      106,         42,   95]);
        dados.push(['Mai', 40,            10,            35,     81,         95,      106,         42,   95]);
        dados.push(['Jun', 40,            10,            35,     81,         95,      106,         42,   95]);
        dados.push(['Jul', 40,            10,            35,     81,         95,      106,         42,   95]);
        dados.push(['Ago', 40,            10,            35,     81,         95,      106,         42,   95]);
        dados.push(['Set', 40,            10,            35,     81,         95,      106,         42,   95]);
        dados.push(['Out', 40,            10,            35,     81,         95,      106,         42,   95]);
        dados.push(['Nov', 40,            10,            35,     81,         95,      106,         42,   95]);
        dados.push(['Dez', 40,            10,            35,     81,         95,      106,         42,   95]);
    
        return dados;
    }
}