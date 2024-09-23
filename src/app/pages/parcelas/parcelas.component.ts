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
        this.parcelasService.GetParcelasByDespesa(success.id).subscribe(parcelas => {
          this.parcelas = parcelas.filter(filtradas => filtradas.isPaga != 1 && new Date(filtradas.dataVencimento).getUTCFullYear() == this.systemService.ano.valor)
          this.parcelasPagas = parcelas.filter(x => x.isPaga == 1);
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
    let cont = this.contas.find(x => x.id == this.idConta);
    if (cont) {
      if (this.listaPagamento.length > 0){
        this.listaPagamento.map( parcela => {
          if (cont.debito - parcela.valor >= 0) {
            cont.debito -= parcela.valor;
            this.contasService.PutConta(cont).subscribe({
              next: (success: Conta) => {
                parcela.isPaga = 1;
                parcela.dataVencimento = new Date();
                this.parcelasService.PutParcela(parcela).subscribe( x => {
                  this.toastr.success("Sucesso", "Parcela Paga com sucesso.");
                });
                this.despesa.valorPago += parcela.valor;
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
    
    this.buscaParcelas();
  } 
  adicionaLista(parcela: Parcela){
    if(parcela.isPaga != 3){
      parcela.isPaga = 3;
      this.listaPagamento.push(parcela);
    }
  }
  Voltar() {
    this.route.navigate(["home"]);
  }
  
  ApagarConta() {
    let podeApagar = true; 
    this.parcelasService.GetParcelasByDespesa(this.despesa.id).subscribe({
      next: (success: Parcela[]) => {
        success.map( parcela => {
          if (parcela.isPaga == 1) {
            if (confirm("Despesa possui parcelas já pagas")){
              podeApagar = false
            }
          }
        });
        if (podeApagar){
          this.despesaService.DeleteDespesa(this.despesa.id).subscribe( x => {
            this.toastr.success("Despesa apagada com Suceeso", "OK");
          })
        }
      }
    });    
  }
    
}
