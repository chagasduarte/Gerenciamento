import { Component, OnInit } from '@angular/core';
import { PlanejamentoService } from '../../services/planejamento.service';
import { Planejamento } from '../../models/planejamento';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';
import { ToastrService } from 'ngx-toastr';
import { Subcategoria } from '../../models/subcategoria.model';
import { SubcategoriaService } from '../../services/subcategoria.service';

@Component({
  selector: 'app-modal-novo-planejamento',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './modal-novo-planejamento.component.html',
  styleUrl: './modal-novo-planejamento.component.css'
})
export class ModalNovoPlanejamentoComponent implements OnInit {
    planejamento: Planejamento = {
      categoria: "",
      tipo: "ENTRADA",
      valor: 0,
      subcategoria: "",
      categoriaid: 0,
      subcategoriaid: 0,
      data: new Date()
    }
    categorias: Categoria[] = [];
    subcategorias: Subcategoria[] = [];

    constructor(
      private readonly planejamentoService: PlanejamentoService,
      private readonly categoriaService: CategoriaService,
      private readonly toast: ToastrService,
      private readonly subcategoriaService: SubcategoriaService
    ){}
    
    ngOnInit(): void {
      this.categoriaService.listar().subscribe({
        next: (success: Categoria[]) => {
          this.categorias = success;
        }
      })
    }

    salvarPlanejamento() {
      this.planejamento.categoria = this.categorias.find(x => x.id == this.planejamento.categoriaid)?.nome!
      this.planejamento.subcategoria = this.subcategorias.find(x => x.id == this.planejamento.subcategoriaid)?.nome!
      this.planejamentoService.criar(this.planejamento).subscribe({
        next: (success) => {
          this.toast.success(success.categoria);
        }
      })
    }

    buscaSub(idcategoria: number){
      this.subcategoriaService.listar(idcategoria).subscribe({
        next: (succeess) => {
          this.subcategorias = succeess;
        }
      })
    }
}
