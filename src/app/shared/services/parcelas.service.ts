import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Parcela, ParcelaRequest } from '../models/parcela';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParcelasService {
  api: string;

  constructor(
    private readonly http: HttpClient,
    private readonly appSettingService: AppSettingsService 
  ) {
    this.api = appSettingService.get().WebApi + "/Parcelas";
  }
  GetParcelas() : Observable<Parcela[]>{
    return this.http.get<Parcela[]>(`${this.api}`);
  }

  GetParcelasByDespesa(idDespesa: number) : Observable<Parcela[]>{
    return this.http.get<Parcela[]>(`${this.api}/Despesa/${idDespesa}`);
  }
  
  GetParcela(id: number) : Observable<Parcela>{
    return this.http.get<Parcela>(`${this.api}/${id}`);
  }

  GetParcelasByMesAndId(idDespesa: number, mes: number) : Observable<Parcela[]>{
    return this.http.get<Parcela[]>(`${this.api}/${idDespesa}/${mes}`);
  }

  GetParcelasByMes(mes: number) : Observable<Parcela[]>{
    return this.http.get<Parcela[]>(`${this.api}/Mes/${mes}`);
  }

  PostParcela(request: ParcelaRequest) : Observable<number[]> {
    return this.http.post<number[]>(`${this.api}`, request);
  }

  PutParcela(request: Parcela) : Observable<Parcela> {
    return this.http.put<Parcela>(`${this.api}/${request.id}`, request);
  }

  DeleteParcelasByDespesa(despesa: number){
    return this.http.delete(`${this.api}/Despesa/${despesa}`);
  }

}
