import { Component, Input } from '@angular/core';
import { Objetivo } from '../../models/objetivo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-objetivos',
  imports: [CommonModule],
  templateUrl: './card-objetivos.component.html',
  styleUrl: './card-objetivos.component.css'
})
export class CardObjetivosComponent {
  @Input() objetivo!: Objetivo;

  get progresso() {
    return Math.round((this.objetivo.valor_acumulado / this.objetivo.valor_objetivo) * 100);
  }
}
