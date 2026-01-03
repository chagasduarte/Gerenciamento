import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards',
  imports: [CommonModule],
  templateUrl: './cards.component.html',
  styleUrls: [
    './cards.component.css',
    './cards.component.mobile.css',
  ]
})
export class CardsComponent {
  @Input() titulo: string = '';
  @Input() valor: number = 0;
  @Input() tipo: 'entrada' | 'saida' | 'saldo' = 'entrada';

  get icone(): string {
    return this.tipo === 'entrada' ? '↑' : this.tipo == 'saida'? '↓': '=';
  }
}
