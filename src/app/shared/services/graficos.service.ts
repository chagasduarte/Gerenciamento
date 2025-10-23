import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Entrada } from '../models/entradas';
import { Observable } from 'rxjs';
import { FormataEntrada } from '../../utils/functions/entrada';
import { Graficos, MesGrafico, TipoDespesaGrafico } from '../models/graficos';
import { Projecao } from '../models/projecao.model';

@Injectable({
  providedIn: 'root'
})
export class GraficoService {
  api: string;
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingService: AppSettingsService 
  ) {
    this.api = appSettingService.get().WebApi;
  }

  GetGraficos(ano: number): Observable<MesGrafico[]>{
    return this.http.get<MesGrafico[]>(`${this.api}?ano=${ano}`);
  }
  GetGraficosPizza(ano: number): Observable<TipoDespesaGrafico[]> {
    return this.http.get<TipoDespesaGrafico[]>(`${this.api}/dashboard/agrupamento?ano=${ano}`);
  }
  GetProjecao(ano: number): Observable<Projecao[]>{
    return this.http.get<Projecao[]>(`${this.api}/dashboard/projecao?ano=${ano}`);
  }
}