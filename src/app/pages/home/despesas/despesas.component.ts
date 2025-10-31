import { Component } from '@angular/core';
import { Despesa } from '../../../shared/models/despesa';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ParcelaRequest } from '../../../shared/models/parcela';
import { Conta } from '../../../shared/models/conta';
import { TransacaoModel } from '../../../shared/models/despesa.model';
import { ToastrService } from 'ngx-toastr';
import { TransacoesService } from '../../../shared/services/transacoes.service';
import { CartaoCredito } from '../../../shared/models/cartao-credito.model';

@Component({
    selector: 'app-despesas',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './despesas.component.html',
    styleUrl: './despesas.component.css'
})
export class DespesasComponent {
  contas: Conta[] = []
  isCartao: boolean = false;
  requestParcela: ParcelaRequest; 

  dataCompra: Date = new Date();
  novaDespesa!: TransacaoModel;
  transacaoCartao!: CartaoCredito 

  constructor(
    private readonly despesaService: TransacoesService,
    private readonly route: Router,
    private readonly toastService: ToastrService,
  ){
    this.novaDespesa = {} as TransacaoModel;
    this.requestParcela = {} as ParcelaRequest;
  }
  OnSubmit() {
    this.novaDespesa.data = new Date(this.dataCompra);
    this.novaDespesa.categoria = parseInt(this.novaDespesa.categoria.toString());
    this.novaDespesa.status = 'pendente';
    if(this.isCartao) {
      this.novaDespesa.tipo = 'cartao';
    }
    else {
      this.novaDespesa.tipo = 'saida';
      this.despesaService.PostTransacao(this.novaDespesa).subscribe({
        next: (success: TransacaoModel) => {
            this.toastService.success("Gravado");
            this.route.navigate(["gastos"]);
        },
        error: (err: any) => {
          this.toastService.error(err.message);
          this.route.navigate(["home"]);
        }
      })
    }
  }
}
