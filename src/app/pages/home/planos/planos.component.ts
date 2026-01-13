import { Component, OnInit } from '@angular/core';
import { Planejamento } from '../../../shared/models/planejamento';
import { PlanejamentoService } from '../../../shared/services/planejamento.service';
import { SystemService } from '../../../shared/services/system.service';
import { combineLatest, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PlanoFormComponent } from "../../../shared/components/plano-form/plano-form.component";
import { PlanoCardComponent } from "../../../shared/components/plano-card/plano-card.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-planos',
  imports: [PlanoFormComponent, PlanoCardComponent, CommonModule, FormsModule],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.css'
})
export class PlanosComponent implements OnInit {


  planos: Planejamento[] = [];
  mostrarFormulario = false;
  planoSelecionado?: Planejamento;


  constructor(
    private planosService: PlanejamentoService,
    private systemService: SystemService,
    private readonly toast: ToastrService
  ) {}


  ngOnInit(): void {
    this.carregarPlanos();
  }


  carregarPlanos() {
    combineLatest([
      this.systemService.ano$,
      this.systemService.mes$
    ]).subscribe(([ano, mes]) => {
      forkJoin([
          this.planosService.listar(mes.valor + 1, ano.valor)
        ]).subscribe({
        next: (success) => {
          this.planos = success[0];
        },
        error: (err) => {
          console.error(err);
          this.toast.error(err.message);
        } 
      })
    });
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