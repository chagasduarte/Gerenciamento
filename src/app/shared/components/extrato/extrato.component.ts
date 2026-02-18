import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TransacaoModel } from '../../models/despesa.model';
import { TransacoesService } from '../../services/transacoes.service';
import { CommonModule } from '@angular/common';
import { SystemService } from '../../services/system.service';
import { combineLatest, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { ModalNovaTransacaoComponent } from "../modal-nova-transacao/modal-nova-transacao.component";
import { ModalEditarTransacaoComponent } from "../modal-editar-transacao/modal-editar-transacao.component";
import { ToastrService } from 'ngx-toastr';
import { SubcategoriaService } from '../../services/subcategoria.service';
import { Subcategoria } from '../../models/subcategoria.model';
import { CartaoService } from '../../services/cartao.service';
import { Cartao } from '../../models/cartao.model';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-extrato',
  imports: [
    CommonModule,
    ModalNovaTransacaoComponent,
    ModalEditarTransacaoComponent,
    FormsModule
  ],
  templateUrl: './extrato.component.html',
  styleUrls: [
    './extrato.component.css',
    './extrato.component.mobile.css',
  ]
})
export class ExtratoComponent implements OnInit {
  transacoes: TransacaoModel[] = [];
  transacoesFiltradas: TransacaoModel[] = [];
  @Input() limit: number = 0;
  @Input() pagina: boolean = false;
  subcategorias!: Subcategoria[];
  cartoes: Cartao[] = [];
  cartaoid = 0;
  status = "todos";
  selecionaTodos = false;
  soma = 0;
  private subscription = new Subscription();
  @ViewChild(ModalEditarTransacaoComponent) modalEditar!: ModalEditarTransacaoComponent;

  filtroTipo: string = 'todos';
  filtroTexto: string = '';
  tipos: string[] = [];

  constructor(
    private readonly transacoesService: TransacoesService,
    private readonly systemService: SystemService,
    private readonly router: Router,
    private readonly toast: ToastrService,
    private readonly subcategoriaService: SubcategoriaService,
    private readonly cartoeService: CartaoService
  ) { }

  ngOnInit(): void {
    this.carregarDados();

    this.subscription.add(
      this.transacoesService.transacoesAlteradas$.subscribe(() => {
        this.carregarDados();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  carregarDados(): void {
    combineLatest([
      this.systemService.ano$,
      this.systemService.mes$
    ]).subscribe(([ano, mes]) => {
      forkJoin([
        this.transacoesService.Extrato(this.limit, mes.valor + 1, ano.valor),
        this.subcategoriaService.listarAll(),
        this.cartoeService.listar()
      ]).subscribe({
        next: (success) => {
          this.transacoes = success[0];
          this.transacoesFiltradas = success[0];
          this.subcategorias = success[1];
          this.cartoes = success[2];

          this.extractTipos();
          this.filtrar();
        },
        error: (err: any) => {
          console.error(err);
        }
      });
    });
  }

  extractTipos() {
    this.tipos = [...new Set(this.transacoes.map(t => t.tipo))].sort();
  }

  trackByIndex(index: number) {
    return index;
  }

  defineImagem(tipoDespesa: number): string {
    return this.subcategorias.find(x => x.id == tipoDespesa)?.icone!;
  }

  abrirEdicao(item: TransacaoModel) {
    this.modalEditar.prepararEdicao(item);
  }
  toEstrato() {
    this.router.navigate(['extrato']);
  }
  apagar(id: number) {
    this.transacoesService.DeleteTransacao(id).subscribe({
      next: () => {
        this.toast.success("Deletado");
        this.transacoesService.notificarAlteracao();
        this.systemService.atualizarResumo();
      }
    })
  }

  efetivar(item: TransacaoModel) {
    item.status = 'pago'
    this.transacoesService.PutEntrada(item.id).subscribe({
      next: (success) => {
        this.toast.success("Tudo Ok");
        this.transacoesService.notificarAlteracao();
        this.systemService.atualizarResumo();
      }
    });
  }

  restituir(item: TransacaoModel) {
    item.status = 'pendente'
  }

  parcelas(descricao: string) {
    this.router.navigate(["parcelas"], { queryParams: { descricao: descricao } })
  }

  getCartaoName(id: number): string {
    return this.cartoes.find(x => x.id == id)?.nome!
  }
  toggleSelecionarTodos(): void {
    this.soma = 0;
    this.transacoesFiltradas.forEach(t => {
      t.selecionado = this.selecionaTodos
      if (t.selecionado)
        this.soma += parseFloat(t.valor.toString());
    });
  }

  atualizarSelecionarTodos(): void {
    this.soma = 0;
    this.selecionaTodos = this.transacoesFiltradas.every(t => t.selecionado);
    this.transacoesFiltradas.forEach(t => {
      if (t.selecionado)
        this.soma += parseFloat(t.valor.toString());
    });
  }

  filtrar(): void {
    this.transacoesFiltradas = this.transacoes.filter(t => {
      // 1. Filter by Cartao
      const byCartao = (this.cartaoid === 0) || (t.cartaoid == this.cartaoid);

      // 2. Filter by Status
      const byStatus = (this.status === 'todos') || (t.status === this.status);

      // 3. Filter by Tipo
      const byTipo = (this.filtroTipo === 'todos') || (t.tipo === this.filtroTipo);

      // 4. Filter by Text (Description)
      const byTexto = !this.filtroTexto || t.descricao.toLowerCase().includes(this.filtroTexto.toLowerCase());

      return byCartao && byStatus && byTipo && byTexto;
    });

    // Reset selection calculation after filter
    this.atualizarSelecionarTodos();
  }
  ordenarPorValor() {
    this.transacoesFiltradas.sort((a, b) => a.valor - b.valor);
  }
}
