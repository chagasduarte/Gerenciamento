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
    anosDeDivida: number[] = [2024, 2025, 2026];
    legendas: {nome: string, cor: string}[] = [
        {nome: "Alimentação", cor: "rgb(56, 124, 141)"}, 
        {nome: "Transporte", cor: "rgb(182, 47, 47)"},
        {nome: "Saúde", cor: "rgb(226, 224, 111)"},
        {nome: "Lazer", cor: "rgb(0, 0, 100)"},
        {nome: "Educacao", cor: "rgb(135, 67, 141)"},
        {nome: "Educacao", cor: "rgb(0, 100, 0)"},
        {nome: "Moradia", cor: "rgb(255, 165, 0)"}
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
        this.graficosService.GetGraficos(this.systemService.ano.valor).subscribe(x => {
            this.tipoDespesaAgrupada = x.tipoDespesaAgrupada.sort((a,b) => { return a.tipoDespesa - b.tipoDespesa });
            this.graficos = x.meses.sort((a,b) => {return a.id - b.id});
            x.meses.map( x => {
                if (this.systemService.ano.maiorValor < Math.abs(x.progressao)){
                    this.systemService.ano.maiorValor = Math.abs(x.progressao);
                }
                if (x.progressao < 0){
                    this.contemMenorQZero = true;
                }
            })
        })
    }

    DefinirCor(valor: number): string {
        return DefineCor(valor)
    }
    DefineHeight(valor: number): string {
        return (Math.abs(valor) * 200 / this.systemService.ano.maiorValor) + 'px';
    }
    voltar(){
        this.router.navigate(['home'])
    }
    mudaAno(ano: number){
        this.systemService.ano = new Ano(ano);
        this.buscaDados()
    }
}