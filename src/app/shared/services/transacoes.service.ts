import { EntradasResponse } from '../models/entradas.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Entrada } from '../models/entradas';
import { Observable } from 'rxjs';
import { ResumoMensal } from '../models/resumo.model';
import { Parcelas, TransacaoModel, Transacoes } from '../models/despesa.model';
import { DespesasParceladasResponse } from '../models/despesasParceladas.model';
import { AgrupamentoResponse } from '../models/agrupamento';
import { Projecao } from '../models/projecao.model';
import { TipoDespesaGrafico } from '../models/graficos';
import { LinhaTemporal } from '../models/linha-temporal.model';
import { PordiaResponse } from '../models/PorDiaResponse';

@Injectable({
  providedIn: 'root'
})
export class TransacoesService {
  api: string;
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingService: AppSettingsService 
  ) {
    this.api = appSettingService.get().WebApi;
  }

  PostTransacao(entrada: TransacaoModel): Observable<TransacaoModel> {
    return this.http.post<TransacaoModel>(`${this.api}/transacoes`, entrada);
  }

  PostTrasacoesParceladas(payload: any): Observable<TransacaoModel[]> {
    return this.http.post<TransacaoModel[]>(`${this.api}/transacoes/parceladas`, payload);
  }

  GetDespesas(mes: number, ano: number, cardid: number | null): Observable<Transacoes> {
    let query = `${this.api}/transacoes?mes=${mes}&ano=${ano}`;
    if(cardid != null && cardid > 0){
      query += `&cardId=${cardid}`;
    }
    return this.http.get<Transacoes>(query);
  }

  GetResumoMensal(mes: number, ano: number): Observable<ResumoMensal> {
    return this.http.get<ResumoMensal>(`${this.api}/dashboard/resumo?mes=${mes}&ano=${ano}`)
  }
  GetEntradas(mes: number, ano: number): Observable<EntradasResponse>{
    return this.http.get<EntradasResponse>(`${this.api}/transacoes/entradas?mes=${mes}&ano=${ano}`);
  }

  PutEntrada(id: number) : Observable<Entrada> {
    return this.http.get<Entrada>(`${this.api}/transacoes/topago/${id}`);
  }

  DeleteTransacao(id: number) {
    return this.http.delete(`${this.api}/transacoes/${id}`)
  }

  GetDespesasParceladas(mes: number, ano: number): Observable<DespesasParceladasResponse>{
    return this.http.get<DespesasParceladasResponse>(`${this.api}/transacoes/parceladas?mes=${mes}&ano=${ano}`)
  }

  GetAgrupamento(mes: number, ano: number, tipo: string): Observable<AgrupamentoResponse> {
    return this.http.get<AgrupamentoResponse>(`${this.api}/transacoes/agrupadaPorTipos?mes=${mes}&ano=${ano}&tipo=${tipo}`)
  }

  GetProjecao(ano: number): Observable<Projecao[]>{
    return this.http.get<Projecao[]>(`${this.api}/dashboard/projecao?ano=${ano}`)
  }

  GetGraficosPizza(ano: number): Observable<TipoDespesaGrafico[] >{
    return this.http.get<TipoDespesaGrafico[] >(`${this.api}/dashboard/agrupamento?ano=${ano}`)
  }

  GetParcelas(descricao: string): Observable<Parcelas>{
    return this.http.get<Parcelas>(`${this.api}/transacoes/despesa?descricao=${descricao}`)
  }

  GetLinhaTemporal(ano: number): Observable<LinhaTemporal[]>{
    return this.http.get<LinhaTemporal[]>(`${this.api}/transacoes/linhatemporal?ano=${ano}`)
  }

  GetByDay(dia: number, mes: number, ano: number): Observable<PordiaResponse> {
    return this.http.get<PordiaResponse>(`${this.api}/transacoes/pordia?dia=${dia}&mes=${mes}&ano=${ano}`)
  }
  
  save(pay: any): Observable<boolean>{
    return this.http.post<boolean>(`${this.api}/transacoes/save`, pay);
  }

  Extrato(limit: number, mes: number, ano: number): Observable<TransacaoModel[]>{
    return this.http.get<TransacaoModel[]>(`${this.api}/transacoes/extrato?limit=${limit}&mes=${mes}&ano=${ano}`);
  }
}
