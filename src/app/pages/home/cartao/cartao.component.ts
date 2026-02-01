import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Cartao } from '../../../shared/models/cartao.model';
import { CartaoService } from '../../../shared/services/cartao.service';

@Component({
  selector: 'app-cartao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cartao.component.html',
  styleUrls: [
    './cartao.component.css',
    './cartao.component.mobile.css'
  ]
})
export class CartaoComponent implements OnInit {
  cartoes: Cartao[] = [];
  novoCartao: Partial<Cartao> = {
    id: 0,
    nome: '',
    limite: 0,
    dia_fatura: undefined,
    dia_vencimento: undefined
  };
  loading = false;

  constructor(
    private readonly cartaoService: CartaoService,
    private readonly toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.carregarCartoes();
  }

  carregarCartoes(): void {
    this.cartaoService.listar().subscribe({
      next: (cartoes) => {
        this.cartoes = cartoes;
      },
      error: (err) => {
        this.toast.error('Erro ao carregar cartões');
      }
    });
  }

  salvar(): void {
    if (!this.novoCartao.nome || !this.novoCartao.limite || !this.novoCartao.dia_fatura) {
      this.toast.warning('Preencha os campos obrigatórios (Nome, Limite, Dia da Fatura)');
      return;
    }

    this.loading = true;
    if (this.novoCartao.id) {
      this.cartaoService.atualizar(this.novoCartao as Cartao).subscribe({
        next: () => {
          this.toast.success('Cartão atualizado com sucesso');
          this.cancelarEdicao();
          this.carregarCartoes();
          this.loading = false;
        },
        error: (err) => {
          this.toast.error('Erro ao atualizar cartão');
          this.loading = false;
        }
      });
    }
    else {
      this.cartaoService.criar(this.novoCartao).subscribe({
        next: () => {
          this.toast.success('Cartão adicionado com sucesso');
          this.cancelarEdicao();
          this.carregarCartoes();
          this.loading = false;
        },
        error: (err) => {
          this.toast.error('Erro ao salvar cartão');
          this.loading = false;
        }
      });
    }

  }

  editar(cartao: Cartao): void {
    this.novoCartao = { ...cartao };
  }

  cancelarEdicao(): void {
    this.novoCartao = { id: 0, nome: '', limite: 0, dia_fatura: undefined, dia_vencimento: undefined };
  }

  getDateFromDay(day: number): Date {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), day);
  }

  isPastDay(day: number): boolean {
    const today = new Date();
    return today.getDate() > day;
  }
}
