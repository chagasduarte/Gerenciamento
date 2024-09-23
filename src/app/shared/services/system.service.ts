import { Injectable } from '@angular/core';
import { Ano, Mes } from '../../utils/meses';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  mes: Mes;
  ano: Ano;
  entradas: number[] = [];
  saidas: number[] = [];
  graficos: boolean = false;
  constructor() { 
    for (let i = 0; i < 12; i++){
      this.entradas[i] = 0;
      this.saidas[i] = 0;
    }
    this.ano = new Ano();
    this.mes = new Mes(new Date().getUTCMonth());    
  }
}
