import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Planejamento } from '../../models/planejamento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plano-card',
  imports: [CommonModule, FormsModule],
  templateUrl: './plano-card.component.html',
  styleUrl: './plano-card.component.css'
})
export class PlanoCardComponent {
@Input() plano!: Planejamento;


@Output() editar = new EventEmitter<void>();
@Output() excluir = new EventEmitter<void>();
}
