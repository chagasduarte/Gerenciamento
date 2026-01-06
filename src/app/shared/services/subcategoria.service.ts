import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { Subcategoria } from '../models/subcategoria.model';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {
  private api: string;
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingService: AppSettingsService 
  ) {
    this.api = appSettingService.get().WebApi;
  }
  
  listar(idcategoria: number): Observable<Subcategoria[]>{
    return this.http.get<Subcategoria[]>(`${this.api}/subcategorias/categoria/${idcategoria}`);
  }
  listarAll(): Observable<Subcategoria[]>{
    return this.http.get<Subcategoria[]>(`${this.api}/subcategorias`);
  }
}
