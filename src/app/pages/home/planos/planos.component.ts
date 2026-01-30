import { Component, OnInit } from '@angular/core';
import { Planejamento } from '../../../shared/models/planejamento';
import { PlanejamentoService } from '../../../shared/services/planejamento.service';
import { SystemService } from '../../../shared/services/system.service';
import { combineLatest, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PlanoFormComponent } from "../../../shared/components/plano-form/plano-form.component";
import { SumPlanosPipe } from '../../../shared/pipes/sum-planos.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-planos',
  imports: [PlanoFormComponent, CommonModule, FormsModule, SumPlanosPipe],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.css'
})
export class PlanosComponent implements OnInit {


  planos: Planejamento[] = [];
  planosAgrupados: { categoria: string, itens: Planejamento[] }[] = [];
  mostrarFormulario = false;
  planoSelecionado?: Planejamento;


  constructor(
    private planosService: PlanejamentoService,
    private systemService: SystemService,
    private readonly toast: ToastrService
  ) { }


  ngOnInit(): void {
    this.carregarPlanos();
  }


  carregarPlanos() {
    combineLatest([
      this.systemService.ano$,
      this.systemService.mes$
    ]).subscribe(([ano, mes]) => {
      this.planosService.listar(mes.valor + 1, ano.valor).subscribe({
        next: (success) => {
          this.planos = success;
          this.agruparPlanos();
        },
        error: (err) => {
          console.error(err);
          this.toast.error(err.message);
        }
      });
    });
  }


  agruparPlanos() {
    const grupos: { [key: string]: Planejamento[] } = {};
    this.planos.forEach((p: Planejamento) => {
      if (!grupos[p.categoria]) {
        grupos[p.categoria] = [];
      }
      grupos[p.categoria].push(p);
    });
    this.planosAgrupados = Object.keys(grupos).map(categoria => ({
      categoria,
      itens: grupos[categoria]
    }));
    console.log(this.planosAgrupados);
  }


  atualizarValor(plano: Planejamento) {
    if (plano.id) {
      this.planosService.atualizar(plano.id, plano).subscribe({
        next: () => {
          this.toast.success('Valor atualizado com sucesso');
          this.carregarPlanos();
        },
        error: (err) => {
          this.toast.error('Erro ao atualizar valor');
        }
      });
    }
  }


  excluirSubcategoria(id: number) {
    if (confirm('Deseja excluir esta subcategoria?')) {
      this.planosService.deletar(id).subscribe({
        next: () => {
          this.toast.success('Subcategoria excluída');
          this.carregarPlanos();
        },
        error: (err) => {
          this.toast.error('Erro ao excluir subcategoria');
        }
      });
    }
  }


  novoPlano() {
    this.planoSelecionado = undefined;
    this.mostrarFormulario = true;
  }


  editar(plano: Planejamento) {
    this.planoSelecionado = plano;
    this.mostrarFormulario = true;
  }


  excluir(id: number) {
    if (confirm('Deseja excluir este plano?')) {
      this.planosService.deletar(id).subscribe(() => this.carregarPlanos());
    }
  }


  fecharFormulario() {
    this.mostrarFormulario = false;
    this.carregarPlanos();
  }
}