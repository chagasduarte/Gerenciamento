import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Entrada } from '../models/entradas';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntradasService {
  api: string;
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingService: AppSettingsService 
  ) {
    this.api = appSettingService.get().WebApi + "/Entradas";
  }
  
  GetEntradas(): Observable<Entrada[]>{
     return this.http.get<Entrada[]>(`${this.api}`);
  }
  
  PostEntrada(entrada: Entrada): Observable<Entrada> {
    return this.http.post<Entrada>(`${this.api}`,entrada);
  }
}