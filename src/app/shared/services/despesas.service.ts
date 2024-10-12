import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Despesa } from '../models/despesa';
import { Observable } from 'rxjs';
import { FormataDespesa } from '../../utils/functions/despesa';

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

  GetDespesas(ano: number): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(`${this.api}/Ano?ano=${ano}`);
  }

  GetDespesasParceladas(mes: number, ano: number): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(`${this.api}/Parceladas?mes=${mes}&ano=${ano}`);
  }

  GetDespesasAdicionais(ano: number): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(`${this.api}/Adicionais?ano=${ano}`);
  }

  GetDespesasFixas(): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(`${this.api}/Fixas`);
  }

  GetDespesasById(id: number): Observable<Despesa> {
    return this.http.get<Despesa>(`${this.api}/${id}`);
  }

  GetDespesasByMes(mes: number, ano: number): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(`${this.api}/Mes?mes=${mes}&ano=${ano}`);
  }
  
  PostDespesa(despesa: Despesa): Observable<Despesa> {
    const desppost = FormataDespesa(despesa);
    return this.http.post<Despesa>(`${this.api}`, desppost);
  }

  PutDespesa(despesa: Despesa): Observable<Despesa> {
    return this.http.put<Despesa>(`${this.api}/${despesa.Id}`, despesa);
  }
  
  DeleteDespesa(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
