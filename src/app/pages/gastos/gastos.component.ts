import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DespesasService } from '../../shared/services/despesas.service';
import { Despesa } from '../../shared/models/despesa';
import { Ano, Mes } from '../../utils/meses';
import { Router } from '@angular/router';
import { SystemService } from '../../shared/services/system.service';
import { ContasService } from '../../shared/services/contas.service';
import { ToastrService } from 'ngx-toastr';
import { Conta } from '../../shared/models/conta';

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
export class GastosComponent {




  gastos!: Despesa[]
  contas!: Conta[]
  listaPagamento: Despesa[] = []
  ano!: Ano;
  totalPagar: number = 0;
  conta!: Conta;
  idConta!: number;

  constructor(
   private readonly despesaService: DespesasService,
   private readonly contasService: ContasService,
   private readonly router: Router,
   private readonly systemsService: SystemService,
   private readonly toastService: ToastrService
  ){
    this.calculaGastosDoMes();
    this.buscaContas();
  }

  calculaGastosDoMes(){
    console.log(this.systemsService.mes.nome);
    this.despesaService.GetDespesasByMes(this.systemsService.mes.valor).subscribe({
      next: (success: Despesa[]) => {
        this.gastos = success.filter(x => !x.isParcelada);
      },
      error: (err: any) => {

      }
    });
  }

  adicionarListaPagamento(despesa: Despesa){
    this.totalPagar = 0;
    this.listaPagamento.push(despesa);
  }

  pagar() {
    let contaput = this.contas.find(x => x.id == this.idConta);
    if(contaput){
      if(this.listaPagamento.length > 0) {
        this.listaPagamento.map(despesa => {
          contaput.debito -= despesa.valorTotal;
          this.contasService.PutConta(contaput!).subscribe(x => {
            despesa.isPaga = true;
            this.despesaService.PutDespesa(despesa).subscribe({
              next: (success: Despesa) => {
                this.toastService.success("Sucesso", "Despesa paga com sucesso");
              },
              error: (err: any) => {
                this.toastService.error("Erro", "Ocorreu algum erro no processo de atualização.")
              }
            })
          });
        });
      }
      else {
        this.toastService.warning("Aviso", "Selecione uma despesa para ser paga");
      }
    }
    else {
      this.toastService.warning("Aviso", "Selecione uma conta para fazer esse pagamento");
    }
    
  }

  Voltar() {
    this.router.navigate([""]);
  }

  buscaContas(){
    this.contasService.GetContas().subscribe(x => this.contas = x );
  }
}
