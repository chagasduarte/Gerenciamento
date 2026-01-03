import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';

@Component({
  selector: 'app-planejamento',
  imports: [
    CommonModule
  ],
  templateUrl: './planejamento.component.html',
  styleUrl: './planejamento.component.css'
})
export class PlanejamentoComponent {
  tipo: string = "Saídas";
  planejados: number = 0;
  saidas: number = 100;
  percent: number = 0;
  abaAtiva: 'entradas' | 'saidas' = 'saidas';

  selecionar(tab: 'entradas' | 'saidas') {
    this.abaAtiva = tab;
  }
}
