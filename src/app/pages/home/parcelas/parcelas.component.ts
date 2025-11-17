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
  somaAbertos: number = 0;
  somaPagos: number = 0;
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
          console.log(x);
          this.parcelasPagas = x.despesa.filter(x => x.status == 'pago');
          this.parcelas = x.despesa.filter(x => x.status == 'pendente' && new Date(x.data).getUTCFullYear() == this.ano.valor);
          
          this.somaAbertos = this.parcelas.reduce((acc, p) => ({
            soma: acc.soma + parseFloat(p.valor.toString())
          }), { soma: 0  }).soma;

          this.somaPagos = this.parcelasPagas.reduce((acc, p) => ({
            soma: acc.soma + parseFloat(p.valor.toString())
          }), { soma: 0  }).soma;
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
      this.systemService.atualizarResumo();
      this.buscaParcelas();
      this.totalPagar = 0;
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

  adicionarListaPagamento(despesa: TransacaoModel){
    this.totalPagar += parseFloat(despesa.valor.toString());
    this.listaPagamento.push(despesa);
    despesa.adicionada = true;
  }
  
  removedaListaPagamento(despesa: TransacaoModel){
    this.totalPagar -= parseFloat(despesa.valor.toString());
    this.listaPagamento = this.listaPagamento.filter( x => x.id != despesa.id );
    despesa.adicionada = false;
  }
  
  Voltar() {
    this.route.navigate(["home"]);
  }
  

  abrirSelecionadas() {
    this.mostrarSelecionadas = !this.mostrarSelecionadas;
  }

  DefineCorParcela(parcela: Date): string {
    return new Date(parcela) < new Date()? "#af6e6e" : "#b1ca78";
  }

}
