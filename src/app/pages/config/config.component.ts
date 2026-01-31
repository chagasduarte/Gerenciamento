import { Component, OnInit } from '@angular/core';
import { TransacoesService } from '../../shared/services/transacoes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SubcategoriaService } from '../../shared/services/subcategoria.service';
import { Subcategoria } from '../../shared/models/subcategoria.model';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  imports: [
    CommonModule,
    FormsModule
  ],
  styleUrls: ['./config.component.css'],
})
export class ConfigComponent implements OnInit {

  tab: 'entrada' | 'saida' = 'entrada';

  entradas: any[] = [];
  saidas: any[] = [];

  showOnboarding = true; // Controla a exibição do overlay de explicação

  constructor(
    private transacoesService: TransacoesService,
    private readonly toastService: ToastrService,
    private readonly router: Router,
    private readonly subcategoriaService: SubcategoriaService
  ) {
  }

  ngOnInit(): void {
    this.initDefaults();
  }

  initDefaults() {
    this.entradas = [];
    this.saidas = [];
    this.subcategoriaService.listarAll().subscribe({
      next: (res) => {
        res.filter(x => x.id < 5 || x.id == 22)
          .forEach((subcategoria: Subcategoria) => {
            if (subcategoria.idcategoria == 7) {
              this.entradas.push({
                description: subcategoria.nome,
                value: null,
                type: 'entrada',
                day_of_month: null,
                categoria: subcategoria.id
              });
            } else {
              this.saidas.push({
                description: subcategoria.nome,
                value: null,
                type: 'saida',
                day_of_month: null,
                categoria: subcategoria.id
              });
            }
          });
      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  closeOnboarding() {
    this.showOnboarding = false;
  }

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
    // Filtra itens vazios (sem valor definido) para não salvar lixo, ou valida tudo
    if (this.validaDados()) {
      const payload = {
        entradas: this.entradas,
        saidas: this.saidas
      };
      this.transacoesService.save(payload).subscribe({
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
      // Permite salvar se tiver descrição, mas idealmente deveria ter valor. 
      // O requisito diz "deixando pro usuário preencher somente o valor", então vamos cobrar valor?
      // Por enquanto, mantemos a validação original de descrição, mas adicionamos aviso se valor for 0/null?
      return !x.description || x.description.trim() === '';
    });

    if (temEntradaInvalida) {
      this.toastService.warning("Preencha a descrição de todas as Entradas ou delete as que não for usar.");
      return false;
    }

    const temSaidaInvalida = this.saidas.some((x: any) => {
      return !x.description || x.description.trim() === '';
    });

    if (temSaidaInvalida) {
      this.toastService.warning("Preencha a descrição de todas as Saídas ou delete as que não for usar.");
      return false;
    }

    return true;
  }

}
