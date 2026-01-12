import { Component, OnInit } from '@angular/core';
import { Objetivo } from '../../../shared/models/objetivo';
import { ResumoObjetivosComponent } from "../../../shared/components/resumo-objetivos/resumo-objetivos.component";
import { FiltrosObjetivosComponent } from "../../../shared/components/filtros-objetivos/filtros-objetivos.component";
import { CardObjetivosComponent } from '../../../shared/components/card-objetivos/card-objetivos.component';
import { CommonModule } from '@angular/common';
import { ObjetivosService } from '../../../shared/services/objetivos.service';

@Component({
  selector: 'app-objetivos',
  imports: [
    ResumoObjetivosComponent, 
    FiltrosObjetivosComponent,
    CardObjetivosComponent,
    CommonModule
  ],
  templateUrl: './objetivos.component.html',
  styleUrl: './objetivos.component.css'
})
export class ObjetivosComponent implements OnInit{
  filtroSelecionado = 'todos';

  objetivos: Objetivo[] = [];
  
  get objetivosFiltrados() {
    if (this.filtroSelecionado === 'todos') return this.objetivos;
    return this.objetivos.filter(o => o.status === this.filtroSelecionado);
  }

  constructor(private readonly objetivosService: ObjetivosService){}
  ngOnInit(): void {
    this.objetivosService.listar().subscribe({
      next: (success) => {
        this.objetivos = success;
        console.log(this.objetivos);
      }
    })
  }
  mudarFiltro(filtro: string) {
    this.filtroSelecionado = filtro;
  }
}
