import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Categoria } from '../../../shared/models/categoria.model';
import { Subcategoria } from '../../../shared/models/subcategoria.model';
import { CategoriaService } from '../../../shared/services/categoria.service';
import { SubcategoriaService } from '../../../shared/services/subcategoria.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-categorias',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './categorias.component.html',
    styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
    categorias: Categoria[] = [];
    subcategorias: Subcategoria[] = [];
    categoriaSelecionada: Categoria | null = null;

    novaCategoria: Partial<Categoria> = { id: 0, nome: '', icone: '', cor: '' };
    novaSubcategoria: Partial<Subcategoria> = { id: 0, idcategoria: 0, nome: '', icone: '', cor: '' };

    loading = false;
    mostrarSubcategorias = false;

    constructor(
        private readonly categoriaService: CategoriaService,
        private readonly subcategoriaService: SubcategoriaService,
        private readonly toast: ToastrService
    ) { }

    ngOnInit(): void {
        this.carregarCategorias();
    }

    carregarCategorias(): void {
        this.loading = true;
        this.categoriaService.listar().subscribe({
            next: (data) => {
                this.categorias = data;
                this.loading = false;
            },
            error: () => {
                this.toast.error('Erro ao carregar categorias');
                this.loading = false;
            }
        });
    }

    selecionarCategoria(categoria: Categoria): void {
        this.categoriaSelecionada = categoria;
        this.mostrarSubcategorias = true;
        this.carregarSubcategorias(categoria.id);
        this.novaSubcategoria.idcategoria = categoria.id;
        this.novaSubcategoria.cor = categoria.cor; // Sugerir mesma cor por padrão
    }

    carregarSubcategorias(idCategoria: number): void {
        this.loading = true;
        this.subcategoriaService.listar(idCategoria).subscribe({
            next: (data) => {
                this.subcategorias = data;
                this.loading = false;
            },
            error: () => {
                this.toast.error('Erro ao carregar subcategorias');
                this.loading = false;
            }
        });
    }

    salvarCategoria(): void {
        if (!this.novaCategoria.nome) {
            this.toast.warning('Nome da categoria é obrigatório');
            return;
        }

        this.loading = true;
        if (this.novaCategoria.id) {
            this.categoriaService.UpdateCategoria(this.novaCategoria.id, this.novaCategoria as Categoria).subscribe({
                next: () => {
                    this.toast.success('Categoria atualizada');
                    this.novaCategoria = { id: 0, nome: '', icone: '', cor: '' };
                    this.carregarCategorias();
                },
                error: () => {
                    this.toast.error('Erro ao atualizar categoria');
                    this.loading = false;
                }
            });
        } else {
            this.categoriaService.PostCategoria(this.novaCategoria as Categoria).subscribe({
                next: () => {
                    this.toast.success('Categoria criada');
                    this.novaCategoria = { id: 0, nome: '', icone: '', cor: '' };
                    this.carregarCategorias();
                },
                error: () => {
                    this.toast.error('Erro ao criar categoria');
                    this.loading = false;
                }
            });
        }
    }

    editarCategoria(categoria: Categoria): void {
        this.novaCategoria = { ...categoria };
    }

    deletarCategoria(id: number): void {
        if (confirm('Deseja realmente excluir esta categoria? Todas as subcategorias vinculadas também podem ser afetadas.')) {
            this.categoriaService.DeleteCategoria(id).subscribe({
                next: () => {
                    this.toast.success('Categoria excluída');
                    if (this.categoriaSelecionada?.id === id) {
                        this.categoriaSelecionada = null;
                        this.mostrarSubcategorias = false;
                    }
                    this.carregarCategorias();
                },
                error: () => this.toast.error('Erro ao excluir categoria')
            });
        }
    }

    salvarSubcategoria(): void {
        if (!this.novaSubcategoria.nome || !this.novaSubcategoria.idcategoria) {
            this.toast.warning('Nome e categoria são obrigatórios');
            return;
        }

        this.loading = true;
        if (this.novaSubcategoria.id) {
            this.subcategoriaService.UpdateSubcategoria(this.novaSubcategoria.id, this.novaSubcategoria as Subcategoria).subscribe({
                next: () => {
                    this.toast.success('Subcategoria atualizada');
                    const catId = this.novaSubcategoria.idcategoria!;
                    this.novaSubcategoria = { id: 0, idcategoria: catId, nome: '', icone: '', cor: this.categoriaSelecionada?.cor || '' };
                    this.carregarSubcategorias(catId);
                },
                error: () => {
                    this.toast.error('Erro ao atualizar subcategoria');
                    this.loading = false;
                }
            });
        } else {
            this.subcategoriaService.PostSubcategoria(this.novaSubcategoria as Subcategoria).subscribe({
                next: () => {
                    this.toast.success('Subcategoria criada');
                    const catId = this.novaSubcategoria.idcategoria!;
                    this.novaSubcategoria = { id: 0, idcategoria: catId, nome: '', icone: '', cor: this.categoriaSelecionada?.cor || '' };
                    this.carregarSubcategorias(catId);
                },
                error: () => {
                    this.toast.error('Erro ao criar subcategoria');
                    this.loading = false;
                }
            });
        }
    }

    editarSubcategoria(sub: Subcategoria): void {
        this.novaSubcategoria = { ...sub };
    }

    deletarSubcategoria(id: number): void {
        if (confirm('Deseja realmente excluir esta subcategoria?')) {
            this.subcategoriaService.DeleteSubcategoria(id).subscribe({
                next: () => {
                    this.toast.success('Subcategoria excluída');
                    this.carregarSubcategorias(this.categoriaSelecionada!.id);
                },
                error: () => this.toast.error('Erro ao excluir subcategoria')
            });
        }
    }

    cancelarEdicaoCategoria(): void {
        this.novaCategoria = { id: 0, nome: '', icone: '', cor: '' };
    }

    cancelarEdicaoSubcategoria(): void {
        const catId = this.novaSubcategoria.idcategoria || 0;
        this.novaSubcategoria = { id: 0, idcategoria: catId, nome: '', icone: '', cor: this.categoriaSelecionada?.cor || '' };
    }
}
