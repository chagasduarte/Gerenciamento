import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Observable } from 'rxjs';
import { Cartao } from '../models/cartao.model';

@Injectable({
  providedIn: 'root'
})
export class CartaoService {
  private api: string;
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingService: AppSettingsService
  ) {
    this.api = appSettingService.get().WebApi;
  }
  listar(): Observable<Cartao[]> {
    return this.http.get<Cartao[]>(`${this.api}/cartao`);
  }
  criar(cartao: any): Observable<any> {
    return this.http.post(`${this.api}/cartao`, cartao);
  }

  atualizar(cartao: Cartao): Observable<any> {
    return this.http.put(`${this.api}/cartao`, cartao);
  }
}
