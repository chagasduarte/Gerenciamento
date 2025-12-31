import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards',
  imports: [CommonModule],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent {
  @Input() titulo: string = '';
  @Input() valor: number = 0;
   // 'entrada' | 'saida'
  @Input() tipo: 'entrada' | 'saida' | 'saldo' = 'entrada';

  get icone(): string {
    return this.tipo === 'entrada' ? '↑' : this.tipo == 'saida'? '↓': '=';
  }
}
