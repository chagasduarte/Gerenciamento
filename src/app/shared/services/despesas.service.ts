import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Despesa } from '../models/despesa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DespesasService {
  private api: string
  constructor( private readonly http: HttpClient,
               private readonly appSettingService: AppSettingsService 
   ) { 
    this.api = appSettingService.get().WebApi + "/Despesas";
  }

  GetDespesas(): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(`${this.api}`);
  }

  GetDespesasById(id: string): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(`${this.api}/${id}`);
  }
  
  PostDespesa(despesa: Despesa): Observable<Despesa> {
    return this.http.post<Despesa>(`${this.api}`, despesa);
  }
}
