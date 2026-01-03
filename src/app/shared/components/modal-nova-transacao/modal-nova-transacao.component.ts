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

@Component({
  selector: 'app-modal-nova-transacao',
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './modal-nova-transacao.component.html',
  styleUrl: './modal-nova-transacao.component.css'
})
export class ModalNovaTransacaoComponent implements OnInit{
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
    cartaoid: null
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

  constructor(
    private readonly despesaService: TransacoesService,
    private readonly toastService: ToastrService,
    public readonly systemService: SystemService,
    private readonly categoriaService: CategoriaService
  ){}

  ngOnInit(): void {
    this.categoriaService.listar().subscribe({
      next: (success) => {
        this.categorias = success;
      }
    })
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
      this.despesaService.PostTrasacoesParceladas(payload).subscribe({
        next: (success: TransacaoModel[]) => {
          if (success) {
            this.preencheInformacoes();
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
      this.despesaService.PostTransacao(this.novaDespesa).subscribe(x => {
        this.preencheInformacoes();
        this.toastService.success("Despesa Gravada");
      });
    }
    this.fecharModal();
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
  
  preencheInformacoes(){
      
    combineLatest([
      this.systemService.ano$,
      this.systemService.mes$
    ]).subscribe(([ano, mes]) => {
      forkJoin([
        this.despesaService.GetDespesasParceladas(mes.valor + 1, ano.valor),
        this.despesaService.GetAgrupamento(mes.valor + 1, ano.valor),
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
}
