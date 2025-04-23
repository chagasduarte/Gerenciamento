import { Injectable } from '@angular/core';
import { Ano, Mes } from '../../utils/meses';
import { Pagamento } from '../models/pagamentos';
import { Parcela } from '../models/parcela';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  private _mes = new BehaviorSubject<Mes>(new Mes(new Date().getUTCMonth(), new Date().getUTCFullYear()));
  mes$ = this._mes.asObservable();

  private _ano = new BehaviorSubject<Ano>(new Ano(new Date().getUTCFullYear()));
  ano$ = this._ano.asObservable();  entradas: number[] = [];

  saidas: number[] = [];
  graficos: boolean = false;
  pagamentosParcelas!: Parcela[];
  pagamentosDespesas!: Parcela[]
  
  constructor() { 
    for (let i = 0; i < 12; i++){
      this.entradas[i] = 0;
      this.saidas[i] = 0;
    }
    this.pagamentosParcelas = [];
    this.pagamentosDespesas = [];
  }
  get mes(): Mes {
    return this._mes.value;
  }

  get ano(): Ano {
    return this._ano.value;
  }

  setMes(mes: Mes) {
    this._mes.next(mes);
  }

  setAno(ano: Ano) {
    this._ano.next(ano);
  }
}
