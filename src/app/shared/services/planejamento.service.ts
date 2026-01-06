import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';
import { Planejamento } from '../models/planejamento';
import { Observable } from 'rxjs';
import { PlanejamentoAgrupadoTipo } from '../models/planejamentoagrupado';

@Injectable({
  providedIn: 'root'
})
export class PlanejamentoService {
  private api: string;
  constructor(
    private readonly http: HttpClient,
    private readonly appSettingService: AppSettingsService 
  ) {
    this.api = appSettingService.get().WebApi + '/planejamento';
  }

  /** Criar planejamento */
  criar(dados: Planejamento): Observable<Planejamento> {
    return this.http.post<Planejamento>(`${this.api}`, dados);
  }

  /** Atualizar planejamento */
  atualizar(id: number, dados: Planejamento): Observable<Planejamento> {
    return this.http.put<Planejamento>(`${this.api}/${id}`, dados);
  }

  /** Deletar planejamento */
  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  /** Listar todos */
  listar(mes:number, ano:number): Observable<PlanejamentoAgrupadoTipo[]> {
    return this.http.get<PlanejamentoAgrupadoTipo[]>(`${this.api}?mes=${mes}&ano=${ano}`);
  }

  /** Buscar por ID */
  buscar(id: number): Observable<Planejamento> {
    return this.http.get<Planejamento>(`${this.api}/${id}`);
  }

}
