import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Objetivo } from '../models/objetivo';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObjetivosService {
  private api: string;
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingService: AppSettingsService 
  ) {
    this.api = appSettingService.get().WebApi;
  }
  listar(): Observable<Objetivo[]>{
    return this.http.get<Objetivo[]>(`${this.api}/objetivos`);
  }
  criar(cartao: any): Observable<any> {
    return this.http.post(`${this.api}/objetivos`, cartao);
  }
}
