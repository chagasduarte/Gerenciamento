import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, switchMap, tap, catchError, of } from 'rxjs';
import { Ano, Mes } from '../../utils/meses';
import { ResumoMensal } from '../models/resumo.model';
import { DespesasService } from './despesas.service';
import { Parcela } from '../models/parcela';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private readonly _mes = new BehaviorSubject<Mes>(
    new Mes(new Date().getUTCMonth(), new Date().getUTCFullYear())
  );
  private readonly _ano = new BehaviorSubject<Ano>(
    new Ano(new Date().getUTCFullYear())
  );
  private readonly _resumo = new BehaviorSubject<ResumoMensal | null>(null);

  readonly mes$ = this._mes.asObservable();
  readonly ano$ = this._ano.asObservable();
  readonly resumo$ = this._resumo.asObservable();

  entradas: number[] = Array(12).fill(0);
  saidas: number[] = Array(12).fill(0);
  graficos = false;
  pagamentosParcelas: Parcela[] = [];
  pagamentosDespesas: Parcela[] = [];

  constructor(private readonly infoService: DespesasService) {
    // Atualiza o resumo automaticamente quando mês ou ano mudam
    combineLatest([this.mes$, this.ano$])
      .pipe(
        switchMap(([mes, ano]) =>
          this.infoService.GetResumoMensal(mes.valor+1, ano.valor).pipe(
            tap((resumo) => this._resumo.next(resumo)),
            catchError((err) => {
              console.error('Erro ao buscar resumo mensal:', err);
              this._resumo.next(null);
              return of(null);
            })
          )
        )
      )
      .subscribe();
  }

  get mes(): Mes {
    return this._mes.value;
  }

  get ano(): Ano {
    return this._ano.value;
  }

  setMes(mes: Mes): void {
    this._mes.next(mes);
  }

  setAno(ano: Ano): void {
    this._ano.next(ano);
  }
}
