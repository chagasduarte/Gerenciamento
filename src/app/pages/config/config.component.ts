import { Component } from '@angular/core';
import { TransacoesService } from '../../shared/services/transacoes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  imports: [
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./config.component.css'],
})
export class ConfigComponent {

  tab: 'entrada' | 'saida' = 'entrada';

  entradas: any = [];
  saidas: any  = [];

  constructor(
    private fixedService: TransacoesService,
    private readonly toastService: ToastrService,
    private readonly router: Router
  ) {}

  addEntrada() {
    this.entradas.push({ description: '', value: null, day_of_month: null });
  }

  removeEntrada(i: number) {
    this.entradas.splice(i, 1);
  }

  addSaidaPadrao(event: any) {
    const nome = event.target.value;
    if (!nome) return;

    this.saidas.push({
      description: nome,
      value: null,
      type: nome.toLowerCase(),
      day_of_month: null,
      categoria: 6
    });

    event.target.value = '';
  }

  addSaidaCustom() {
    this.saidas.push({
      description: '',
      value: null,
      type: 'custom',
      day_of_month: null,
      categoria: 6
    });
  }

  removeSaida(i: number) {
    this.saidas.splice(i, 1);
  }

  salvar() {
    if(this.validaDados()) {
      const payload = {
        entradas: this.entradas,
        saidas: this.saidas
      };
      this.fixedService.save(payload).subscribe({
        next: () => {
          this.toastService.success('Configurações salvas!');
          this.router.navigate(["home"]);
        },
        error: () => this.toastService.error('Erro ao salvar')
      });
    }
  }

  validaDados(): boolean {
    const temEntradaInvalida = this.entradas.some((x: any) => {
      return !x.description || x.description.trim() === '';
    });

    if (temEntradaInvalida) {
      this.toastService.warning("Preencha todos os campos ou delete a Receita que não irá usar");
      return false;
    }
    const temSaidaInvalida = this.saidas.some((x: any) => {
      return !x.description || x.description.trim() === '';
    });

    if (temSaidaInvalida) {
      this.toastService.warning("Preencha todos os campos ou delete a Receita que não irá usar");
      return false;
    }

    return true;
  }

  
}
