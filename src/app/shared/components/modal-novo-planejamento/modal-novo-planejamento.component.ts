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
import { forkJoin } from 'rxjs';

interface ItemRapido {
  nome: string;
  valor: number | null;
  subcategoriaId: number;
  categoriaId: number;
  tipo: string;
}

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
    tipo: "saidas",
    valor: 0,
    subcategoria: "",
    categoriaid: 0,
    subcategoriaid: 0,
    data: new Date()
  }
  categorias: Categoria[] = [];
  subcategorias: Subcategoria[] = [];

  // Quick Mode Properties
  modo: 'simples' | 'detalhado' = 'simples';
  itensRapidos: ItemRapido[] = [];
  nomesSugestivosSaida = ['Aluguel', 'Água', 'Luz', 'Internet', 'Condomínio', 'Mercado'];
  nomesSugestivosEntrada = ['Salário', 'Renda Extra', 'Investimentos'];

  constructor(
    private readonly planejamentoService: PlanejamentoService,
    private readonly categoriaService: CategoriaService,
    private readonly toast: ToastrService,
    private readonly subcategoriaService: SubcategoriaService
  ) { }

  ngOnInit(): void {
    forkJoin([
      this.categoriaService.listar(),
      this.subcategoriaService.listarAll()
    ]).subscribe({
      next: ([categorias, subcategorias]) => {
        this.categorias = categorias;
        // We can keep subcategorias loaded for the simple mode matching
        this.prepararItensRapidos(subcategorias);
      }
    });
  }

  prepararItensRapidos(subcategorias: Subcategoria[]) {
    this.itensRapidos = [];

    const adicionarSeExistir = (nome: string, tipo: string) => {
      // Find subcategory case-insensitive
      const sub = subcategorias.find(s => s.nome.toLowerCase() === nome.toLowerCase());
      if (sub) {
        this.itensRapidos.push({
          nome: sub.nome,
          valor: null,
          subcategoriaId: sub.id,
          categoriaId: sub.idcategoria, // Assuming this exists on Subcategoria model
          tipo: tipo
        });
      }
    };
    this.nomesSugestivosSaida = subcategorias.filter(x => x.idcategoria != 7).map(s => s.nome);
    this.nomesSugestivosEntrada = subcategorias.filter(x => x.idcategoria == 7).map(s => s.nome);
    this.nomesSugestivosSaida.forEach(nome => adicionarSeExistir(nome, 'saidas'));
    this.nomesSugestivosEntrada.forEach(nome => adicionarSeExistir(nome, 'entradas'));
  }

  salvarPlanejamento() {
    // Logic for Detailed Mode
    this.planejamento.categoria = this.categorias.find(x => x.id == this.planejamento.categoriaid)?.nome!
    this.planejamento.subcategoria = this.subcategorias.find(x => x.id == this.planejamento.subcategoriaid)?.nome!
    this.planejamentoService.criar(this.planejamento).subscribe({
      next: (success) => {
        this.toast.success('Planejamento criado com sucesso!');
      }
    })
  }

  salvarLote() {
    const itensParaSalvar = this.itensRapidos.filter(i => i.valor && i.valor > 0);

    if (itensParaSalvar.length === 0) {
      this.toast.warning('Preencha pelo menos um valor.');
      return;
    }

    let processados = 0;

    itensParaSalvar.forEach(item => {
      const novoPlan: Planejamento = {
        categoria: this.categorias.find(c => c.id === item.categoriaId)?.nome || '',
        tipo: item.tipo,
        valor: Number(item.valor),
        subcategoria: item.nome,
        categoriaid: item.categoriaId,
        subcategoriaid: item.subcategoriaId,
        data: new Date()
      };

      this.planejamentoService.criar(novoPlan).subscribe({
        next: () => {
          processados++;
          if (processados === itensParaSalvar.length) {
            this.toast.success(`${processados} planejamentos criados!`);
            // Optional: Clear values
            this.itensRapidos.forEach(i => i.valor = null);
          }
        }
      });
    });
  }

  buscaSub(idcategoria: number) {
    this.subcategoriaService.listar(idcategoria).subscribe({
      next: (succeess) => {
        this.subcategorias = succeess;
      }
    })
  }

  trocarModo(modo: 'simples' | 'detalhado') {
    this.modo = modo;
  }
}
