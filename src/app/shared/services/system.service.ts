import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, switchMap, tap, catchError, of } from 'rxjs';
import { Ano, Mes } from '../../utils/meses';
import { ResumoMensal } from '../models/resumo.model';
import { TransacoesService } from './transacoes.service';
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

  constructor(private readonly infoService: TransacoesService) {
    // Mantém a atualização automática reativa
    combineLatest([this.mes$, this.ano$])
      .pipe(
        switchMap(([mes, ano]) =>
          this.carregarResumo(mes.valor + 1, ano.valor)
        )
      )
      .subscribe();
  }

  /** 🔹 Atualiza manualmente o resumo com base no mês/ano atual */
  public atualizarResumo(): void {
    this.carregarResumo(this.mes.valor + 1, this.ano.valor)
      .subscribe();
  }

  /** 🔸 Método central usado pelas duas formas (reativa e manual) */
  private carregarResumo(mes: number, ano: number) {
    return this.infoService.GetResumoMensal(mes, ano).pipe(
      tap((resumo) => this._resumo.next(resumo)),
      catchError((err) => {
        this._resumo.next(null);
        return of(null);
      })
    );
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

