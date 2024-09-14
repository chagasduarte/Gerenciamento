import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Observable } from 'rxjs';
import { Conta } from '../models/conta';

@Injectable({
  providedIn: 'root'
})
export class ContasService {
  api: string;
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingService: AppSettingsService 
  ) {
    this.api = appSettingService.get().WebApi + "/Contas";
  }
  GetContaById(id: number) : Observable<Conta> {
    return this.http.get<Conta>(`${this.api}/${id}`);
  }
  GetContaByMes(mes: number, ano: number) : Observable<Conta[]> {
    return this.http.get<Conta[]>(`${this.api}/Mes?mes=${mes}&ano=${ano}`);
  }
  GetContas(): Observable<Conta[]>{
    return this.http.get<Conta[]>(`${this.api}`)
  }
  PostConta(conta: Conta): Observable<Conta> {
    return this.http.post<Conta>(`${this.api}`,conta);
  }
  PutConta(conta: Conta): Observable<Conta> {
    return this.http.put<Conta>(`${this.api}/${conta.id}`, conta);
  }
}
