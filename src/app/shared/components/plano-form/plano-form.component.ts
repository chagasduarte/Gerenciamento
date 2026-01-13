import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Planejamento } from '../../models/planejamento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-plano-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './plano-form.component.html',
  styleUrl: './plano-form.component.css'
})
export class PlanoFormComponent {
@Input() plano?: Planejamento;
@Output() fechar = new EventEmitter<void>();


modelo!: Planejamento;


ngOnInit(): void {
this.modelo = this.plano ? { ...this.plano } : {
id: 0,
categoria: '',
subcategoria: '',
valor: 0,
tipo: 'SAIDA',
data: new Date,
categoriaid: 0,
subcategoriaid: 0
};
}


salvar() {
// integração com service aqui
this.fechar.emit();
}


cancelar() {
this.fechar.emit();
}
}
