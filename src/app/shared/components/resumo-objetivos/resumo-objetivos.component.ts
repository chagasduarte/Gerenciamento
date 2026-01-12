import { Component, Input } from '@angular/core';
import { Objetivo } from '../../models/objetivo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumo-objetivos',
  imports: [CommonModule],
  templateUrl: './resumo-objetivos.component.html',
  styleUrl: './resumo-objetivos.component.css'
})
export class ResumoObjetivosComponent {
  @Input() objetivos: Objetivo[] = [];

  get investimentoMinimo() {
    return this.objetivos.reduce((s, o) => s + o.valor_mensal, 0);
  }

  get ativos() {
    return this.objetivos.length;
  }

  get concluidos() {
    return this.objetivos.filter(o => o.status === 'concluido').length;
  }
}
