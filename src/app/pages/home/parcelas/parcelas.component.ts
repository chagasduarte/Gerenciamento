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
import { TransacoesService } from '../../../shared/services/transacoes.service';
import { forkJoin, lastValueFrom } from 'rxjs';
import { Ano } from '../../../utils/meses';

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

  ano!: Ano;

  parcelas!: TransacaoModel[];
  parcelasPagas!: TransacaoModel[];
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
      private readonly systemService: SystemService,
      private readonly transacoesService: TransacoesService
  ){
    
  }
  ngOnInit(): void {
    this.buscaParcelas();
    this.ano = this.systemService.ano;
  }
  
  buscaParcelas() {
    this.activeRouter.queryParams.subscribe({
      next: (success: any) => {
        this.nomeDespesa = success.descricao
        this.transacoesService.GetParcelas(this.nomeDespesa).subscribe(x => {
          this.parcelasPagas = x.filter(x => x.status == 'pago');
          this.parcelas = x.filter(x => x.status == 'pendente' && new Date(x.data).getUTCFullYear() == this.ano.valor);
        });
      }
    });
  }

  async pagar() {
    if (this.listaPagamento.length === 0) return;

    try {
      const promises = this.listaPagamento.map(item =>
        lastValueFrom(this.transacoesService.PutEntrada(item.id))
      );

      await Promise.all(promises);

      this.toastr.success("Despesas pagas");
    } catch (error) {
      console.error(error);
      this.toastr.error("Erro ao pagar despesas");
    }
  }
  apagar(id: number) {
    this.transacoesService.DeleteTransacao(id).subscribe(x => {
      this.toastr.success("Parcela deletada!");
      this.systemService.atualizarResumo();
      this.buscaParcelas();
    })
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

  DefineCorParcela(parcela: Date): string {
    return new Date(parcela) < new Date()? "#af6e6e" : "#b1ca78";
  }

}
