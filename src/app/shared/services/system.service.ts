import { Injectable } from '@angular/core';
import { Mes } from '../../utils/meses';

@Injectable({
  providedIn: 'root'
})
export class SystemService {
  mes: Mes

  constructor() { 
    this.mes = new Mes(new Date().getMonth() + 1);    
  }
}
