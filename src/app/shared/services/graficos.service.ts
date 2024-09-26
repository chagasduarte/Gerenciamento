import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Entrada } from '../models/entradas';
import { Observable } from 'rxjs';
import { FormataEntrada } from '../../utils/functions/entrada';
import { Graficos } from '../models/graficos';

@Injectable({
  providedIn: 'root'
})
export class GraficoService {
  api: string;
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingService: AppSettingsService 
  ) {
    this.api = appSettingService.get().WebApi + "/Graficos";
  }

  GetGraficos(ano: number): Observable<Graficos>{
    return this.http.get<Graficos>(`${this.api}?ano=${ano}`);
  }

}