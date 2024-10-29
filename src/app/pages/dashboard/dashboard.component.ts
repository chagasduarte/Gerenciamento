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
    tipoDespesaAgrupada!: TipoDespesaGrafico[];
    Alimentacao: TipoDespesaGrafico = {id:0,TipoDespesa:TipoDespesa.Alimentacao,saida:0};

    Transporte: TipoDespesaGrafico = {id:0,TipoDespesa:TipoDespesa.Transporte,saida:0};
    Saude: TipoDespesaGrafico = {id:0,TipoDespesa:TipoDespesa.Saude,saida:0};
    Educacao: TipoDespesaGrafico = {id:0,TipoDespesa:TipoDespesa.Educacao,saida:0};
    Lazer: TipoDespesaGrafico = {id:0,TipoDespesa:TipoDespesa.Lazer,saida:0};
    Moradia: TipoDespesaGrafico = {id:0,TipoDespesa:TipoDespesa.Moradia,saida:0};
    Servicos: TipoDespesaGrafico = {id:0,TipoDespesa:TipoDespesa.Servicos,saida:0};
    Outros: TipoDespesaGrafico = {id:0,TipoDespesa:TipoDespesa.Outros,saida:0};
    Total: number = 0;
    anosDeDivida: number[] = [2024, 2025, 2026];
    legendas: {nome: string, cor: string, porcentagem: number}[] = [
        {nome: "Alimentação", cor: "rgb(56, 124, 141)", porcentagem: 0}, 
        {nome: "Transporte", cor: "rgb(182, 47, 47)", porcentagem: 0},
        {nome: "Saúde", cor: "rgb(226, 224, 111)", porcentagem: 0},
        {nome: "Educacao", cor: "rgb(135, 67, 141)", porcentagem: 0},
        {nome: "Lazer", cor: "rgb(0, 100, 0)", porcentagem: 0},
        {nome: "Moradia", cor: "rgb(0, 0, 100)", porcentagem: 0},
        {nome: "Servico", cor: "rgb(255, 165, 0)", porcentagem: 0}
    ]

    constructor(
        public systemService: SystemService,
        private readonly graficosService: GraficoService,
        private readonly router: Router
    ){
    }
    ngOnInit(): void {
        this.buscaDados()
    }

    buscaDados(){
        this.contemMenorQZero = false;
        this.Total = 0;
        this.Alimentacao.saida = 0;
        this.Transporte.saida = 0;
        this.Saude.saida = 0;
        this.Educacao.saida = 0;
        this.Lazer.saida = 0;
        this.Moradia.saida = 0;
        this.Servicos.saida = 0;

        this.graficosService.GetGraficos(this.systemService.ano.valor).subscribe(x => {
            this.graficos = x.sort((a,b) => {return a.id - b.id});
            x.map( x => {
                if (this.systemService.ano.maiorValor < Math.abs(x.progressao)){
                    this.systemService.ano.maiorValor = Math.abs(x.progressao);
                }
                if (x.progressao < 0){
                    this.contemMenorQZero = true;
                }
            })
        });
        this.graficosService.GetGraficosPizza(this.systemService.ano.valor).subscribe(x => {
            this.tipoDespesaAgrupada = x;
            x.map(despesa => {
                this.Total += parseFloat(despesa.saida.toString());
                switch(despesa.TipoDespesa) {
                    case 1:
                        this.Alimentacao.saida += parseFloat(despesa.saida.toString());
                        break;
                    case 2:
                        this.Transporte.saida += parseFloat(despesa.saida.toString());
                        break;
                    case 3:
                        this.Saude.saida += parseFloat(despesa.saida.toString());
                        break;
                    case 4:
                        this.Educacao.saida += parseFloat(despesa.saida.toString());
                        break;
                    case TipoDespesa.Lazer:
                        this.Lazer.saida += parseFloat(despesa.saida.toString());
                        break;
                    case TipoDespesa.Moradia:
                        this.Moradia.saida += parseFloat(despesa.saida.toString());
                        break;
                    case TipoDespesa.Servicos:
                        this.Servicos.saida += parseFloat(despesa.saida.toString());
                        break;
                    case TipoDespesa.Outros:
                        this.Servicos.saida += parseFloat(despesa.saida.toString());
                        break;
                }
                
            });
            this.legendas.map(legenda => {
                switch(legenda.nome){
                    case "Alimentação":
                        legenda.porcentagem = this.Alimentacao.saida * 100 / this.Total;
                        break;
                    case "Transporte":
                        legenda.porcentagem = this.Transporte.saida * 100/ this.Total;
                        break;
                    case "Saúde":
                        legenda.porcentagem = this.Saude.saida * 100/ this.Total;
                        break;
                    case "Educacao":
                        legenda.porcentagem = this.Educacao.saida * 100/ this.Total;
                        break;
                    case "Lazer":
                        legenda.porcentagem = this.Lazer.saida * 100 / this.Total;
                        break;
                    case "Moradia":
                        legenda.porcentagem = this.Moradia.saida * 100 / this.Total;
                        break;
                    case "Servico":
                        legenda.porcentagem = this.Servicos.saida * 100 / this.Total;
                        break;
                }
            })
        });
    }

    DefinirCor(valor: number): string {
        return DefineCor(valor)
    }
    DefineHeight(valor: number): string {
        return (Math.abs(valor) * 190 / this.systemService.ano.maiorValor) + 'px';
    }
    voltar(){
        this.router.navigate(['home'])
    }
    mudaAno(ano: number){
        this.systemService.ano = new Ano(ano);
        this.buscaDados()
    }
}