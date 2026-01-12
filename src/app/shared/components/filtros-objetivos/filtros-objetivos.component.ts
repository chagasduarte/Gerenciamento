import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filtros-objetivos',
  imports: [],
  templateUrl: './filtros-objetivos.component.html',
  styleUrl: './filtros-objetivos.component.css'
})
export class FiltrosObjetivosComponent {
  @Output() filtroChange = new EventEmitter<string>();

  selecionar(filtro: string) {
    this.filtroChange.emit(filtro);
  }
}
