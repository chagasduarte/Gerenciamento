import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Entrada } from '../models/entradas';
import { Observable } from 'rxjs';
import { FormataEntrada } from '../../utils/functions/entrada';
import { EntradasResponse } from '../models/entradas.model';

@Injectable({
  providedIn: 'root'
})
export class EntradasService {
  api: string;
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingService: AppSettingsService 
  ) {
    this.api = appSettingService.get().WebApi + "/transacoes";
  }
  
  GetEntradas(mes: number, ano: number): Observable<EntradasResponse>{
     return this.http.get<EntradasResponse>(`${this.api}/entradas?mes=${mes}&ano=${ano}`);
  }
  
  PostEntrada(entrada: Entrada): Observable<Entrada> {
    const entrpost = FormataEntrada(entrada);
    return this.http.post<Entrada>(`${this.api}`, entrpost);
  }

  PutEntrada(id: number) : Observable<Entrada> {
    return this.http.put<Entrada>(`${this.api}/topago/${id}`, id);
  }

  DeleteEntrada(id: number) {
    return this.http.delete(`${this.api}/${id}`)
  }
}
