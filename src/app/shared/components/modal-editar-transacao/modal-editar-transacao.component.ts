import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TransacaoModel } from '../../models/despesa.model';
import { TransacoesService } from '../../services/transacoes.service';
import { ToastrService } from 'ngx-toastr';
import { SystemService } from '../../services/system.service';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';
import { SubcategoriaService } from '../../services/subcategoria.service';
import { Subcategoria } from '../../models/subcategoria.model';
import { Cartao } from '../../models/cartao.model';
import { CartaoService } from '../../services/cartao.service';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-modal-editar-transacao',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: './modal-editar-transacao.component.html',
    styleUrls: ['./modal-editar-transacao.component.css']
})
export class ModalEditarTransacaoComponent implements OnInit {
    @Input() transacao: TransacaoModel = new TransacaoModel();
    @Output() salvou = new EventEmitter<void>();

    categorias: Categoria[] = [];
    subcategorias: Subcategoria[] = [];
    cartoes: Cartao[] = [];

    categoriaId: number = 0;
    dataCompra: string = '';
    isCartao: boolean = false;

    constructor(
        private readonly transacaoService: TransacoesService,
        private readonly toastService: ToastrService,
        private readonly systemService: SystemService,
        private readonly categoriaService: CategoriaService,
        private readonly subcategoriaService: SubcategoriaService,
        private readonly cartoesService: CartaoService
    ) { }

    ngOnInit(): void {
        this.carregarCategorias();
        this.carregarCartoes();
    }

    carregarCategorias() {
        this.categoriaService.listar().subscribe(success => {
            this.categorias = success;
            if (this.transacao.idcategoria) {
                this.categoriaId = this.transacao.idcategoria;
                this.carregarSubcategorias(this.categoriaId);
            }
        });
    }

    carregarCartoes() {
        this.cartoesService.listar().subscribe(success => {
            this.cartoes = success;
        });
    }

    prepararEdicao(transacao: TransacaoModel) {
        this.transacao = { ...transacao };
        this.categoriaId = transacao.idcategoria || 0;
        this.isCartao = !!transacao.cartaoid;

        // Format date for <input type="date">
        if (this.transacao.data) {
            const date = new Date(this.transacao.data);
            this.dataCompra = date.toISOString().split('T')[0];
        }

        if (this.categoriaId) {
            this.carregarSubcategorias(this.categoriaId);
        }

        this.abrirModal();
    }

    carregarSubcategorias(id: number) {
        this.subcategoriaService.listar(id).subscribe(success => {
            this.subcategorias = success;
        });
    }

    salvar() {
        this.transacao.data = new Date(this.dataCompra);
        this.transacao.idcategoria = this.categoriaId;
        this.transacao.cartaoid = this.isCartao ? this.transacao.cartaoid : null;

        this.transacaoService.UpdateTransacao(this.transacao.id, this.transacao).subscribe({
            next: () => {
                this.toastService.success("Transação atualizada com sucesso");
                this.transacaoService.notificarAlteracao();
                this.systemService.atualizarResumo();
                this.fecharModal();
                this.salvou.emit();
            },
            error: (err) => {
                this.toastService.error("Erro ao atualizar transação");
                console.error(err);
            }
        });
    }

    abrirModal() {
        const modal = document.getElementById('editTransacaoModal');
        if (modal) {
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            modal.setAttribute('aria-modal', 'true');
            modal.style.display = 'block';
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
            document.body.classList.add('modal-open');
        }
    }

    fecharModal() {
        const modal = document.getElementById('editTransacaoModal');
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
}
