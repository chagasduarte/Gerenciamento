import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private api: string;
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingService: AppSettingsService
  ) {
    this.api = appSettingService.get().WebApi;
  }

  listar(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.api}/categorias`);
  }

  PostCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.api}/categorias`, categoria);
  }

  UpdateCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.api}/categorias/${id}`, categoria);
  }

  DeleteCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.api}/categorias/${id}`);
  }
}
