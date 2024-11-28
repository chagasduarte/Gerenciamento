import { Component, OnInit } from '@angular/core';
import { ContasService } from '../../shared/services/contas.service';
import { ActivatedRoute, Route, Router, RouterLinkActive } from '@angular/router';
import { ParcelasService } from '../../shared/services/parcelas.service';
import { Parcela } from '../../shared/models/parcela';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conta } from '../../shared/models/conta';
import { ToastrService } from 'ngx-toastr';
import { DespesasService } from '../../shared/services/despesas.service';
import { Despesa } from '../../shared/models/despesa';
import { forkJoin } from 'rxjs';
import { SystemService } from '../../shared/services/system.service';

@Component({
  selector: 'app-parcelas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './parcelas.component.html',
  styleUrl: './parcelas.component.css'
})
export class ParcelasComponent implements OnInit {

  parcelas!: Parcela[];
  parcelasPagas!: Parcela[]
  contas!: Conta[];
  idConta: number = 1;
  listaPagamento: Parcela[] = [];
  nomeDespesa!: string;
  despesa!: Despesa;
  totalPagar: number = 0;

  constructor(
      private readonly parcelasService: ParcelasService,
      private readonly activeRouter: ActivatedRoute,
      private readonly contasService: ContasService,
      private readonly despesaService: DespesasService,
      private readonly route: Router,
      private readonly toastr: ToastrService,
      private readonly systemService: SystemService
  ){
    
  }
  ngOnInit(): void {
    this.buscaParcelas();
    this.buscaContas();
  }
  
  buscaParcelas() {
    let valorpago = 0;
    this.activeRouter.queryParams.subscribe({
      next: (success: any) => {
        this.nomeDespesa = success.nome
        this.despesaService.GetDespesasById(success.id).subscribe(x => {
          this.despesa = x;
        });
        this.parcelasService.GetParcelasByDespesa(success.id).subscribe(parcelas => {
          this.parcelas = parcelas.filter(filtradas => filtradas.IsPaga != 1 && new Date(filtradas.DataVencimento).getUTCFullYear() == this.systemService.ano.valor)
          this.parcelasPagas = parcelas.filter(x => x.IsPaga == 1);
        });
      }
    });
  }

  buscaContas(){
    this.contasService.GetContaByMes(new Date().getUTCMonth() + 1, new Date().getUTCFullYear() ).subscribe(x => {
      this.contas = x;
    })
  }

  pagar() {
    let cont = this.contas.find(x => x.Id == this.idConta);
    if (cont) {
      if (this.listaPagamento.length > 0){
        this.listaPagamento.map( parcela => {
          if (cont.Debito - parcela.Valor >= 0) {
            cont.Debito -= parcela.Valor;
            this.contasService.PutConta(cont).subscribe({
              next: (success: Conta) => {
                parcela.IsPaga = 1;
                this.parcelasService.PutParcela(parcela).subscribe( x => {
                  this.toastr.success("Sucesso", "Parcela Paga com sucesso.");
                });
                this.despesa.ValorPago = parseFloat(this.despesa.ValorPago.toString());
                this.despesa.ValorPago += parseFloat(parcela.Valor.toString());
                this.despesaService.PutDespesa(this.despesa).subscribe(x => {
                  this.despesa = x;
                  this.toastr.success("Sucesso", "Valor Total da Despesa Atualizado com sucesso.");
                })
              },
              error: (err:any) => {
                this.toastr.error("Erro", "Não foi possível realizar o pagamento.")
              }
            });
          }
          else {
            this.toastr.warning("Você é pobre de mais para comprar isso, então não gaste mais", "Aviso")
          }
        });    
      }
    }
    else{
      this.listaPagamento.forEach( parcela => {
        parcela.IsPaga = 1;
        this.parcelasService.PutParcela(parcela).subscribe( x => {
          this.toastr.success("Sucesso", "Parcela modificado com status de paga");
        });
        this.despesa.ValorPago = parseFloat(this.despesa.ValorPago.toString());
        this.despesa.ValorPago += parseFloat(parcela.Valor.toString());
        this.despesaService.PutDespesa(this.despesa).subscribe(x => {
          this.despesa = x;
          this.toastr.success("Sucesso", "Valor Total da Despesa Atualizado com sucesso.");
        });
      });
    }
    this.buscaParcelas();
    this.listaPagamento = [];
    this.totalPagar = 0;
  } 
  adicionaLista(parcela: Parcela){
    this.totalPagar += parseFloat(parcela.Valor.toString());
    this.listaPagamento.push(parcela);
  }

  Voltar() {
    this.route.navigate(["home"]);
  }
  
  ApagarConta() {
    let podeApagar = true; 
    this.parcelasService.GetParcelasByDespesa(this.despesa.Id).subscribe({
      next: (success: Parcela[]) => {
        success.map( parcela => {
          if (parcela.IsPaga == 1) {
            if (confirm("Despesa possui parcelas já pagas")){
              podeApagar = false
            }
          }
        });
        if (podeApagar){
          this.despesaService.DeleteDespesa(this.despesa.Id).subscribe( x => {
            this.toastr.success("Despesa apagada com Suceeso", "OK");
          })
        }
      }
    });    
  }

  despagar(despesa: Parcela){
    despesa.IsPaga = 0;
    this.parcelasService.PutParcela(despesa).subscribe(x => {
      this.toastr.success("pois é... pra tu ver como é as coisa", "Success");
    })
  }
  removedaListaPagamento(parcela: Parcela) {
    this.totalPagar -= parseFloat(parcela.Valor.toString());
    this.listaPagamento = this.listaPagamento.filter( x => x.Id != parcela.Id);
    console.log(this.listaPagamento)
  }   
}
