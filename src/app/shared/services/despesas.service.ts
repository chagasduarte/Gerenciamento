import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Despesa } from '../models/despesa';
import { Observable } from 'rxjs';
import { FormataDespesa } from '../../utils/functions/despesa';
import { DespesasParceladasResponse } from '../models/despesasParceladas.model';
import { ResumoMensal } from '../models/resumo.model';
import { AgrupamentoResponse } from '../models/agrupamento';
import { DespesaModel, Transacoes } from '../models/despesa.model';

@Injectable({
  providedIn: 'root'
})
export class DespesasService {
  private api: string
  constructor( private readonly http: HttpClient,
               private readonly appSettingService: AppSettingsService 
   ) { 
    this.api = appSettingService.get().WebApi;
  }
  GetAll(): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(`${this.api}/`);
  }
  
  GetDespesas(mes: number, ano: number): Observable<Transacoes> {
    return this.http.get<Transacoes>(`${this.api}/transacoes?mes=${mes}&ano=${ano}`);
  }
  
  GetDespesasParceladas(mes: number, ano: number): Observable<DespesasParceladasResponse> {
    return this.http.get<DespesasParceladasResponse>(`${this.api}/transacoes/parceladas?mes=${mes}&ano=${ano}`);
  }

  GetResumoMensal(mes: number, ano: number): Observable<ResumoMensal>{
    return this.http.get<ResumoMensal>(`${this.api}/dashboard/resumo?mes=${mes}&ano=${ano}`);
  }

  GetAgrupamento(mes: number, ano: number): Observable<AgrupamentoResponse> {
    return this.http.get<AgrupamentoResponse>(`${this.api}/transacoes/agrupadaPorTipos?mes=${mes}&ano=${ano}`)
  }

  GetDespesasParceladasNaoPagas(mes: number, ano: number): Observable<Despesa[]> {
    return this.http.get<Despesa[]>(`${this.api}/ParceladasNaoPagas?mes=${mes}&ano=${ano}`);
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
  
  PostDespesa(despesa: DespesaModel): Observable<DespesaModel> {
    return this.http.post<DespesaModel>(`${this.api}/transacoes`, despesa);
  }

  PutDespesa(despesa: Despesa): Observable<Despesa> {
    return this.http.put<Despesa>(`${this.api}/transacoes/${despesa.Id}`, despesa);
  }
  
  DeleteDespesa(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }
}
