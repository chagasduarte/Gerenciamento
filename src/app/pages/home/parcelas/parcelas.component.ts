import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Parcela } from '../../../shared/models/parcela';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conta } from '../../../shared/models/conta';
import { ToastrService } from 'ngx-toastr';
import { Despesa } from '../../../shared/models/despesa';
import { SystemService } from '../../../shared/services/system.service';
import { Pagamento } from '../../../shared/models/pagamentos';
import { TransacaoModel, Transacoes } from '../../../shared/models/despesa.model';

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
  parcelasPagas!: Parcela[];
  contas!: Conta[];
  idConta: number = 1;
  listaPagamento: TransacaoModel[] = [];
  nomeDespesa!: string;
  despesa!: Despesa;
  totalPagar: number = 0;
  pagamentos: Pagamento[] = [];
  mostrarSelecionadas = false;

  constructor(
      private readonly activeRouter: ActivatedRoute,
      private readonly route: Router,
      private readonly toastr: ToastrService,
      private readonly systemService: SystemService
  ){
    
  }
  ngOnInit(): void {
    this.buscaParcelas();
  }
  
  buscaParcelas() {
    this.activeRouter.queryParams.subscribe({
      next: (success: any) => {
        this.nomeDespesa = success.descricao
        
      }
    });
  }

  pagar() {
    
  } 
  adicionaLista(parcela: TransacaoModel){
    console.log(parcela)
    this.totalPagar += parseFloat(parcela.valor.toString());
    this.listaPagamento.push(parcela);
    // this.pagamentos.push({TipoPagamento: 1, IdPagamento: parcela.Id});
    console.log(this.listaPagamento)
  }

  Voltar() {
    this.route.navigate(["home"]);
  }
  
  removedaListaPagamento(parcela: Parcela) {
    this.totalPagar -= parseFloat(parcela.Valor.toString());
  }   

  abrirSelecionadas() {
    this.mostrarSelecionadas = !this.mostrarSelecionadas;
  }
  DefineCorParcela(parcela: Parcela): string {
    return new Date(parcela.DataVencimento) < new Date()? "#af6e6e" : "#b1ca78";
  }
}
