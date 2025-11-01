import { Component, OnInit } from '@angular/core';
import { Ano } from '../../../utils/meses';
import { CommonModule } from '@angular/common';
import { Despesa } from '../../../shared/models/despesa';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SystemService } from '../../../shared/services/system.service';
import { combineLatest, forkJoin } from 'rxjs';
import { DefineCor } from '../../../utils/functions/defineCorGrafico';
import { FormsModule } from '@angular/forms';
import { DespesasParceladasResponse } from '../../../shared/models/despesasParceladas.model';
import { ResumoMensal } from '../../../shared/models/resumo.model';
import { AgrupamentoResponse } from '../../../shared/models/agrupamento';
import { TransacoesService } from '../../../shared/services/transacoes.service';
import { Projecao } from '../../../shared/models/projecao.model';
import { TipoDespesaGrafico } from '../../../shared/models/graficos';
import { drawCategoriaPie } from '../../dashboard/drawcharts/categorias.pie';
import { drawProjecoes } from '../../dashboard/drawcharts/progressao.coloumn';
import { drawMediasBar } from '../../dashboard/drawcharts/medias.bar';

@Component({
  selector: 'app-dados',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.css', './dados.component.mobile.css']
})
export class DadosComponent implements OnInit {
  ano!: Ano;
  novasParcelas!: DespesasParceladasResponse;
  resumoMensal$ = this.systemService.resumo$; // <-- agora é reativo
  novoAgrupamento!: AgrupamentoResponse;
  projecoes!: Projecao[]; 
  tipoDespesaAgrupada: TipoDespesaGrafico[] = [];

  constructor(
    private readonly despesaService: TransacoesService,
    private readonly toastService: ToastrService,
    private readonly router: Router,
    public readonly systemService: SystemService,
  ){
    this.ano = new Ano(this.systemService.ano.valor);
  }

  ngOnInit(): void { 
    this.preencheInformacoes();
  }
  
  preencheInformacoes(){
    
   combineLatest([
      this.systemService.ano$,
      this.systemService.mes$
    ]).subscribe(([ano, mes]) => {
      this.ano = ano;
      forkJoin([
        this.despesaService.GetDespesasParceladas(mes.valor + 1, ano.valor),
        this.despesaService.GetAgrupamento(mes.valor + 1, ano.valor),
        this.despesaService.GetProjecao(ano.valor),
        this.despesaService.GetGraficosPizza(ano.valor)
      ]).subscribe({
        next: (success) => {
          this.novasParcelas = success[0];
          this.novoAgrupamento = success[1];
          this.projecoes = success[2];
          this.tipoDespesaAgrupada = success[3];
        },
        error: (err: any) => {
          
        }
      });
    });
  }

  adicionarDespesa() {
    this.router.navigate(["despesas"]);
  }

  parcelas(descricao: string) {
    this.router.navigate(["parcelas"], { queryParams: {descricao: descricao}})
  }

  gastos() {
    this.router.navigate(["gastos"]);
  }

  contasDetalhes() {
    this.router.navigate(["contas-detalhe"])
  }

  entradaDetalhes() {
    this.router.navigate(["entradas-detalhe"])
  }
  parseInt(valor: number) {
    return parseInt(valor.toString());
  }
  previstos() {
    this.router.navigate(["previstos"]);
  }

  defineImagem(tipoDespesa: number): string {
   
    switch(tipoDespesa) {
      case 1:
        return "/assets/img/food-wine-cheese-bread-national-culture-paris.svg";
      case 2:
        return "/assets/img/sport-utility-vehicle.svg";
      case 3: 
        return "/assets/img/health.svg";
      case 4: 
        return "/assets/img/books.svg";
      case 5:
        return "/assets/img/beach.svg";
      case 6:
        return "/assets/img/house-with-garden.svg";
      case 7:
        return "/assets/img/customer-service.svg";
      case 8: 
        return "/assets/img/tools-chainsaw.svg";
      case 9: 
        return "/assets/img/revenue.svg";
    }
    return "";
  }
    
  defineCorFeed(status: number): string {
    switch (status) {
      case 0: 
        return "rgb(78, 151, 151)";
      case 1: 
        return "#49865b";
      case 3: 
         return "#af6e6e";
    }
    return "";
  }

  DefinirCor(valor: number): any {
    return DefineCor(valor)
  }
  dashboard(){
    this.router.navigate(['dash'])
  }
  
}

