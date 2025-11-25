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
import { combineLatest, lastValueFrom } from 'rxjs';
import { TransacaoModel, Transacoes } from '../../../shared/models/despesa.model';
import { TransacoesService } from '../../../shared/services/transacoes.service';
import { PordiaResponse } from '../../../shared/models/PorDiaResponse';
import { CartaoService } from '../../../shared/services/cartao.service';
import { Cartao } from '../../../shared/models/cartao.model';

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


  gastos!: TransacaoModel[];
  gastosPagos!: TransacaoModel[];
  listaPagamento: TransacaoModel[] = [];
  mostrarSelecionadas = false;

  ano!: Ano;
  totalPagar: number = 0;

  novo: Transacoes = {} as Transacoes;
  showCard = false;
  novaDespesa: TransacaoModel = 
  {
    categoria: 0,
    descricao: '',
    criado_em: new Date(),
    data: new Date(),
    id: 0,
    status: 'pendente',
    ispaycart: false,
    tipo: 'saida',
    valor: 0
  };
  dataCompra: string = '';
  isCartao: boolean = false;
  isParcelado: boolean = false;

  requestParcela = {
    QtdParcelas: null,
    Valor: null
  };
  cartao!: Cartao[];
  cardId: number | null = null
  constructor(
   private readonly router: Router,
   private readonly systemsService: SystemService,
   private readonly toastService: ToastrService,
   private readonly transacoesService: TransacoesService,
   private readonly cartoesService: CartaoService
  ){
  }
  ngOnInit(): void {
    this.listaDespesas(this.cardId);
    this.systemsService.atualizarResumo();
    this.listaCartoes();
  }

  salvarTransacao() {
    
    if (this.isParcelado) {
      const payload = {
        ...this.novaDespesa,
        data: new Date(this.dataCompra),
        ispaycart: this.isCartao,
        parcelado: this.isParcelado,
        parcelas: this.isParcelado ? this.requestParcela : null
      };
      this.transacoesService.PostTrasacoesParceladas(payload).subscribe({
        next: (success: TransacaoModel[]) => {
          if (success) {
            this.listaDespesas(this.cardId);
            this.toastService.success("Parcelas Gravadas");
          }
        },
        error: (err) => {
          this.toastService.error(err.message);
        },
      })
    }
    else {
      this.novaDespesa.data = new Date(this.dataCompra);
      this.novaDespesa.ispaycart = this.isCartao;
      this.transacoesService.PostTransacao(this.novaDespesa).subscribe(x => {
        this.listaDespesas(null);
        this.toastService.success("Despesa Gravada");
      });
    }
    this.fecharModal();
  }
  listaCartoes(){
    this.cartoesService.listar().subscribe({
      next: (success) => {
        this.cartao = success;
      }
    })
  }
  fecharModal() {
    const modal = document.getElementById('addTransacaoModal');
    if (modal) {
      const backdrop = document.querySelector('.modal-backdrop');
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      modal.style.display = 'none';
      backdrop?.remove();
      document.body.classList.remove('modal-open');
    }
  }

  listaDespesas(cardId: number | string | null) {
    cardId = Number(cardId); // converte para número
    
    combineLatest([
      this.systemsService.ano$,
      this.systemsService.mes$
    ]).subscribe(([ano, mes]) => {
      this.transacoesService.GetDespesas(mes.valor + 1, ano.valor, cardId).subscribe({
        next: (success) => {
          this.novo = success;
        }
      });
    });
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
  
  apagar(id: number){
    this.transacoesService.DeleteTransacao(id).subscribe(x => {
      this.toastService.success("Despesa deletada!!");
      this.systemsService.atualizarResumo();
      this.listaDespesas(this.cardId);
    })
  }
  async pagar() {
      if (this.listaPagamento.length === 0) return;
  
      try {
        const promises = this.listaPagamento.map(item =>
          lastValueFrom(this.transacoesService.PutEntrada(item.id))
        );
  
        await Promise.all(promises);
  
        this.toastService.success("Despesas pagas");
        this.systemsService.atualizarResumo();
        this.listaPagamento = [];
        this.listaDespesas(this.cardId);

      } catch (error) {
        console.error(error);
        this.toastService.error("Erro ao pagar despesas");
      }
    }
  Voltar() {
    this.router.navigate(["home"]);
  }


  AdicionaGasto() {
    this.router.navigate(["despesas"]);
  }

  
  DefineCorParcela(parcela: Date | string): string {
    return new Date(parcela) < new Date()? "#af6e6e" : "#b1ca78";
  }

  objetivos(){
    this.router.navigate(['objetivos'])
  }

  abrirSelecionadas() {
    this.mostrarSelecionadas = !this.mostrarSelecionadas;
  }

}
