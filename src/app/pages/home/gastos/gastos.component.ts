import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Despesa } from '../../../shared/models/despesa';
import { Ano } from '../../../utils/meses';
import { Router } from '@angular/router';
import { SystemService } from '../../../shared/services/system.service';
import { ToastrService } from 'ngx-toastr';
import { Conta } from '../../../shared/models/conta';
import { Parcela } from '../../../shared/models/parcela';
import { combineLatest } from 'rxjs';
import { Transacoes } from '../../../shared/models/despesa.model';
import { TransacoesService } from '../../../shared/services/transacoes.service';

@Component({
    selector: 'app-gastos',
    standalone: true,
    imports: [
      CommonModule,
      FormsModule
    ],
    templateUrl: './gastos.component.html',
    styleUrl: './gastos.component.css'
})
export class GastosComponent implements OnInit{


  gastos!: Despesa[];
  gastosPagos!: Despesa[];
  contas!: Conta[];
  listaPagamento: Despesa[] = [];
  mostrarSelecionadas = false;

  
  parcelas: {parcela: Parcela, despesa:Despesa}[] = [];
  parcelasPagas: {parcela: Parcela, despesa:Despesa}[] = [];
  listaParcelasPagar: {parcela: Parcela, despesa:Despesa}[] = [];

  ano!: Ano;
  totalPagar: number = 0;
  conta!: Conta;
  idConta!: number;
  adicionar: any;
  aindafalta:number = 0;
  aindaFaltaParcelado: number = 0;
  totalPagos: number =0;

  novo!: Transacoes;

  constructor(
   private readonly router: Router,
   private readonly systemsService: SystemService,
   private readonly toastService: ToastrService,
   private readonly transacoesService: TransacoesService
  ){
  }
  ngOnInit(): void {
    this.listaDespesas();
  }

  listaDespesas(){
    combineLatest([
      this.systemsService.ano$,
      this.systemsService.mes$
    ]).subscribe(([ano, mes]) => {
      this.transacoesService.GetDespesas(mes.valor + 1, ano.valor).subscribe({
        next: (success) => {
          this.novo = success;
        }
      })
    });
  }

  adicionarListaPagamento(despesa: Despesa){
    this.totalPagar += parseFloat(despesa.ValorTotal.toString());
    this.listaPagamento.push(despesa);
  }
  
  removedaListaPagamento(despesa: Despesa){
    this.totalPagar -= parseFloat(despesa.ValorTotal.toString());
    this.listaPagamento = this.listaPagamento.filter( x => x.Id != despesa.Id );
  }
  pagar(){

  }
  
  Voltar() {
    this.router.navigate(["home"]);
  }


  AdicionaGasto() {
    this.router.navigate(["despesas"]);
  }

  
  DefineCorParcela(parcela: Date): string {
    return new Date(parcela) < new Date()? "#af6e6e" : "#b1ca78";
  }

  adicionarParcelasLista(parcela: Parcela, despesa:Despesa){
    this.listaParcelasPagar.push({parcela, despesa});
    this.totalPagar += parseFloat(parcela.Valor.toString());
  }

  removedaListaPagamentoParcelas(parcela: Parcela, despesa:Despesa){
    this.totalPagar -= parseFloat(parcela.Valor.toString());
    this.listaParcelasPagar = this.listaParcelasPagar.filter( x => x.parcela.Id != parcela.Id );
  }

  pagarParcelas() {
    
        
  } 
  objetivos(){
    this.router.navigate(['objetivos'])
  }

  abrirSelecionadas() {
    this.mostrarSelecionadas = !this.mostrarSelecionadas;
  }

}
