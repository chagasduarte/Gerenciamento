import { Component, OnInit } from '@angular/core';
import { TransacaoModel } from '../../models/despesa.model';
import { TransacoesService } from '../../services/transacoes.service';
import { ToastrService } from 'ngx-toastr';
import { SystemService } from '../../services/system.service';
import { combineLatest, forkJoin } from 'rxjs';
import { DespesasParceladasResponse } from '../../models/despesasParceladas.model';
import { AgrupamentoResponse } from '../../models/agrupamento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';
import { SubcategoriaService } from '../../services/subcategoria.service';
import { Subcategoria } from '../../models/subcategoria.model';
import { Cartao } from '../../models/cartao.model';
import { CartaoService } from '../../services/cartao.service';
import { CategoriaMap, converterArquivoCsvParaTransacoes } from '../../../utils/functions/importar-fatura.util';

@Component({
  selector: 'app-modal-nova-transacao',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './modal-nova-transacao.component.html',
  styleUrl: './modal-nova-transacao.component.css'
})
export class ModalNovaTransacaoComponent implements OnInit {
  isParcelado: boolean = false;
  novaDespesa: TransacaoModel = {
    categoria: 0,
    descricao: '',
    criado_em: new Date(),
    data: new Date(),
    id: 0,
    status: 'pendente',
    tipo: '',
    ispaycart: false,
    valor: 0,
    cartaoid: null,
    selecionado: false,
    pagamento: new Date()
  };
  dataCompra: string = '';
  isCartao: boolean = false;
  requestParcela = {
    QtdParcelas: null,
    Valor: null
  };
  novasParcelas: DespesasParceladasResponse =
    {
      parcelas: [],
      mensal: {
        pendente: 0
      }
    } as DespesasParceladasResponse;
  novoAgrupamento!: AgrupamentoResponse;
  categorias!: Categoria[];
  subcategorias!: Subcategoria[];
  categoriaId!: number;
  cardId: number = 0;
  cartao!: Cartao[];
  nomeArquivo!: string;
  transacoes: TransacaoModel[] = [];
  cartoes = [{ id: 1, nome: 'Inter' }]; // exemplo
  cartaoSelecionado: number | null = null;
  importando = false;
  mensagem = '';


  constructor(
    private readonly despesaService: TransacoesService,
    private readonly toastService: ToastrService,
    public readonly systemService: SystemService,
    private readonly categoriaService: CategoriaService,
    private readonly subcategoriaService: SubcategoriaService,
    private readonly cartoesService: CartaoService
  ) { }

  ngOnInit(): void {
    this.categoriaService.listar().subscribe({
      next: (success) => {
        this.categorias = success;
      }
    });
    this.listaCartoes();
  }
  salvarTransacao() {
    if (this.isParcelado) {
      const payload = {
        ...this.novaDespesa,
        data: new Date(this.dataCompra),
        ispaycart: this.isCartao,
        parcelado: this.isParcelado,
        idcategoria: this.categoriaId,
        parcelas: this.isParcelado ? this.requestParcela : null,
        cartaoid: this.cardId > 0 ? this.cardId : 0
      };
      console.log(payload);
      this.despesaService.PostTransacoesParceladas(payload).subscribe({
        next: (success: TransacaoModel[]) => {
          if (success) {
            this.preencheInformacoes();
            this.toastService.success("Parcelas Gravadas");
            this.despesaService.notificarAlteracao();
            this.systemService.atualizarResumo();
            this.fecharModal();
          }
        },
        error: (err: any) => {
          const message = err.error?.message || err.error || err.message || "Erro desconhecido";
          this.toastService.error(message);
        },
      })
    }
    else {
      this.novaDespesa.data = new Date(this.dataCompra);
      this.novaDespesa.idcategoria = this.categoriaId;
      this.novaDespesa.ispaycart = this.isCartao;
      this.novaDespesa.cartaoid = this.cardId > 0 ? this.cardId : 0;
      console.log(this.novaDespesa);
      this.despesaService.PostTransacao(this.novaDespesa).subscribe(x => {
        this.preencheInformacoes();
        this.toastService.success("Despesa Gravada");
        this.despesaService.notificarAlteracao();
        this.systemService.atualizarResumo();
        this.fecharModal();
      });
    }
  }
  listaCartoes() {
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

  preencheInformacoes() {

    combineLatest([
      this.systemService.ano$,
      this.systemService.mes$
    ]).subscribe(([ano, mes]) => {
      forkJoin([
        this.despesaService.GetDespesasParceladas(mes.valor + 1, ano.valor),
        this.despesaService.GetAgrupamento(mes.valor + 1, ano.valor, 'saida'),
        this.despesaService.GetProjecao(ano.valor)
      ]).subscribe({
        next: (success) => {
          this.novasParcelas = success[0];
          this.novoAgrupamento = success[1];
        },
        error: (err: any) => {

        }
      });
    });
  }

  buscarsubcategoria(id: number) {
    this.subcategoriaService.listar(id).subscribe({
      next: (success) => {
        this.subcategorias = success;
      }
    });
  }

  async onFile(ev: Event) {

    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const categoriaMap: CategoriaMap = {
      'SUPERMERCADO': 3,
      'RESTAURANTES': 5,
      'OUTROS': 9,
    };

    const transacoes = await converterArquivoCsvParaTransacoes(file, {
      cartaoId: 1,              // <-- seu cartaoid aqui
      categoriaMap,
      statusPadrao: 'pendente',
      tipoPadrao: 'saida',
      isPayCartPadrao: true
    });

    var result = await this.despesaService.enviarUmPorUm(transacoes).subscribe({
      next: (salvas) => console.log('Importadas:', salvas.length),
      error: (err) => console.error('Erro ao importar:', err)
    });
    console.log(result);
  }
}
