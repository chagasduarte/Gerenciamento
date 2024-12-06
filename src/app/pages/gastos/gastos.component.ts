import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DespesasService } from '../../shared/services/despesas.service';
import { Despesa } from '../../shared/models/despesa';
import { Ano, Mes } from '../../utils/meses';
import { Router } from '@angular/router';
import { SystemService } from '../../shared/services/system.service';
import { ContasService } from '../../shared/services/contas.service';
import { ToastrService } from 'ngx-toastr';
import { Conta } from '../../shared/models/conta';
import { DespesasComponent } from "../despesas/despesas.component";
import { ParcelasService } from '../../shared/services/parcelas.service';
import { Parcela } from '../../shared/models/parcela';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DespesasComponent
],
  templateUrl: './gastos.component.html',
  styleUrl: './gastos.component.css'
})
export class GastosComponent implements OnInit{


  gastos!: Despesa[];
  gastosPagos!: Despesa[];
  contas!: Conta[];
  listaPagamento: Despesa[] = [];

  
  parcelas: {parcela: Parcela, despesa:Despesa}[] = [];
  parcelasPagas: {parcela: Parcela, despesa:Despesa}[] = [];
  listaParcelasPagar: {parcela: Parcela, despesa:Despesa}[] = [];

  ano!: Ano;
  totalPagar: number = 0;
  conta!: Conta;
  idConta!: number;
  adicionar: any;
  aindafalta:number = 0;
  totalPagos: number =0;
  constructor(
   private readonly despesaService: DespesasService,
   private readonly contasService: ContasService,
   private readonly router: Router,
   private readonly systemsService: SystemService,
   private readonly toastService: ToastrService,
   private readonly parcelasService: ParcelasService,
  ){
    this.calculaGastosDoMes();
    this.buscaContas();
  }
  ngOnInit(): void {
    this.buscaParcelas();
  }
  calculaGastosDoMes(){

    this.gastos = [];
    this.gastosPagos = [];
    this.contas = [];
    this.listaPagamento = [];
    this.totalPagar = 0;
    this.idConta = 0;
    this.aindafalta = 0;
    this.totalPagos = 0;
    this.despesaService.GetDespesasAdicionais(this.systemsService.ano.valor).subscribe({
      next: (success: Despesa[]) => {
        this.gastos = success.filter(x => !x.IsPaga).filter(x => new Date(x.DataCompra).getUTCMonth() == this.systemsService.mes.valor);
        this.gastosPagos = success.filter(x => x.IsPaga).filter(x => new Date(x.DataCompra).getUTCMonth() == this.systemsService.mes.valor);
        this.gastos.forEach(x => {
          this.aindafalta += parseFloat(x.ValorTotal.toString());
        })
        this.gastosPagos.forEach(x => {
          this.totalPagos += parseFloat(x.ValorTotal.toString());
        })
      },
      error: (err: any) => {
        this.toastService.error("Errou, Porraaaa... Burro!!!", "Erro");
      }
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
    this.pagarDespesa();
    this.pagarParcelas();
  }
  pagarDespesa() {
    let contaput = this.contas.find(x => x.Id == this.idConta);
    if(contaput){
      if(this.listaPagamento.length > 0) {
        this.listaPagamento.map(despesa => {
          if ((contaput.Debito - despesa.ValorTotal) >= 0) {
            contaput.Debito -= despesa.ValorTotal
            despesa.IsPaga = true;
            this.despesaService.PutDespesa(despesa).subscribe({
              next: (success: Despesa) => {
                this.toastService.success("Sucesso", "Despesa paga com sucesso");
              },
              error: (err: any) => {
                this.toastService.error("Erro", "Ocorreu algum erro no processo de atualização.")
              }
            })
           
          }
          else {
            this.toastService.warning("Você é pobre de mais para comprar isso, então não gaste mais", "Aviso");
          }
        });
        this.contasService.PutConta(contaput).subscribe( x => {
          this.toastService.success("conta atualizada com sucesso;", "Ok");
        })
      }
      else {
        this.toastService.warning("Aviso", "Selecione uma despesa para ser paga");
      }
    }
    else {
      if(this.listaPagamento.length > 0) {
        this.listaPagamento.map(despesa => {
          despesa.IsPaga = true;
          this.despesaService.PutDespesa(despesa).subscribe({
            next: (success: Despesa) => {
              this.toastService.success("Sucesso", "Despesa paga com sucesso");
            },
            error: (err: any) => {
              this.toastService.error("Erro", "Ocorreu algum erro no processo de atualização.")
            }
          })          
        });
      }
      else {
        this.toastService.warning("Aviso", "Selecione uma despesa para ser paga");
      }
    }
    this.calculaGastosDoMes();
    this.buscaContas();
    this.listaPagamento = [];
    this.totalPagar = 0;
  }

  Voltar() {
    this.router.navigate(["home"]);
  }

  buscaContas(){
    this.contasService.GetContaByMes(new Date().getUTCMonth() + 1, new Date().getUTCFullYear()).subscribe(x => this.contas = x );
  }

  AdicionaGasto() {
    this.router.navigate(["despesas"]);
  }
    
  apagarGasto(id: number) {
    if (confirm("deseja realmente apagar essa despesa").valueOf()) {
      this.despesaService.DeleteDespesa(id).subscribe(x => {
        this.calculaGastosDoMes();
        this.buscaContas();
      });
    }
  }
  
  despagar(gasto: Despesa){
    gasto.IsPaga = false;
    this.despesaService.PutDespesa(gasto).subscribe({
      next: (success: Despesa) => {
        this.toastService.success("Sucesso", "Despesa de volta a lista de não pagas sucesso");
        this.calculaGastosDoMes();
        this.buscaContas();
      },
      error: (err: any) => {
        this.toastService.error("Erro", "Ocorreu algum erro no processo de atualização.")
      }
    })
  }

  
  buscaParcelas(){

    this.parcelas = [];
    this.parcelasPagas = [];
    this.listaParcelasPagar = [];
    this.parcelasService.GetParcelasByMes(this.systemsService.mes.valor + 1, this.systemsService.ano.valor).subscribe(parcelas => {
      parcelas.map( parcela => {
        parcela.DataVencimento = new Date(parcela.DataVencimento);
        
        this.despesaService.GetDespesasById(parcela.DespesaId).subscribe({
          next: (despesa: Despesa) => {
            if(parcela.IsPaga == 1) {
              this.parcelasPagas.push({parcela: parcela, despesa: despesa});
            }
            else {
              this.parcelas.push({parcela: parcela, despesa: despesa});
            }
          },
          error: (err: any) => {
            console.log(err.status)
            if (err.status == 404){
              this.parcelasService.DeleteParcelasByDespesa(parcela.DespesaId).subscribe( x => {
                this.toastService.warning('Aviso', 'Como essa despesa não foi encontrada, apagamos todas as parcelas referentes a ela.')
              });
            }  
          }
        })
      });
    });
  }
  DefineCorParcela(parcela: Parcela): string {
    return new Date(parcela.DataVencimento) < new Date()? "#af6e6e" : "#b1ca78";
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
}
