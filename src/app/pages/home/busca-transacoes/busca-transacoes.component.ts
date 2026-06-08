import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransacoesService } from '../../../shared/services/transacoes.service';
import { TransacaoModel } from '../../../shared/models/despesa.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-busca-transacoes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './busca-transacoes.component.html',
  styleUrl: './busca-transacoes.component.css'
})
export class BuscaTransacoesComponent {
  termoBusca: string = '';
  transacoes: TransacaoModel[] = [];
  carregando: boolean = false;
  buscaRealizada: boolean = false;

  constructor(
    private transacoesService: TransacoesService,
    private toastr: ToastrService
  ) {}

  buscar() {
    if (!this.termoBusca || this.termoBusca.trim() === '') {
      this.toastr.warning('Digite um termo para buscar.');
      return;
    }

    this.carregando = true;
    this.buscaRealizada = true;
    this.transacoesService.SearchTransacoes(this.termoBusca).subscribe({
      next: (res) => {
        this.transacoes = res;
        this.carregando = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erro ao buscar transações.');
        this.carregando = false;
      }
    });
  }
}
