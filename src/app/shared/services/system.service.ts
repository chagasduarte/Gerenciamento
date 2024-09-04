import { Injectable } from '@angular/core';
import { Mes } from '../../utils/meses';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  mes: Mes;
  entradas: number[] = [];
  saidas: number[] = [];

  constructor() { 
    for (let i = 0; i < 12; i++){
      this.entradas[i] = 0;
      this.saidas[i] = 0;
    }
    this.mes = new Mes(new Date().getUTCMonth());    
  }
}
