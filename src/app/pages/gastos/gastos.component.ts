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
import { DespesasComponent } from "../despesas/despesas.component";

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
export class GastosComponent {


  gastos!: Despesa[];
  gastosPagos!: Despesa[];
  contas!: Conta[];
  listaPagamento: Despesa[] = [];
  ano!: Ano;
  totalPagar: number = 0;
  conta!: Conta;
  idConta!: number;
adicionar: any;

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
    this.despesaService.GetDespesasAdicionais(this.systemsService.ano.valor).subscribe({
      next: (success: Despesa[]) => {
        this.gastos = success.filter(x => !x.isPaga).filter(x => new Date(x.dataCompra).getUTCMonth() == this.systemsService.mes.valor);
        this.gastosPagos = success.filter(x => x.isPaga).filter(x => new Date(x.dataCompra).getUTCMonth() == this.systemsService.mes.valor);;
      },
      error: (err: any) => {
        this.toastService.error("Errou, Porraaaa... Burro!!!", "Erro");
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
          if ((contaput.debito - despesa.valorTotal) >= 0) {
            contaput.debito -= despesa.valorTotal
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
          }
          else {
            this.toastService.warning("Você é pobre de mais para comprar isso, então não gaste mais", "Aviso");
          }
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
      this.despesaService.DeleteDespesa(id).subscribe();
    }
    this.calculaGastosDoMes();
    this.buscaContas();
  }
}
