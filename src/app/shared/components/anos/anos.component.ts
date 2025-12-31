import { Component } from '@angular/core';
import { SystemService } from '../../services/system.service';
import { Ano, Mes } from '../../../utils/meses';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anos',
  imports: [
    CommonModule
  ],
  templateUrl: './anos.component.html',
  styleUrl: './anos.component.css'
})
export class AnosComponent {
  ano!: Ano;
  anosDeDivida = [2024, 2025, 2026, 2027]
  constructor(
    private readonly systemService: SystemService
  ){

  }

  mudaAno(ano: number) {
    if (ano < 2024) return;

    const mesAtual = 
      ano === new Date().getUTCFullYear() ? new Date().getUTCMonth() : 0;

    this.systemService.setAno(new Ano(ano));
    this.systemService.setMes(new Mes(mesAtual, ano));
    this.ano = new Ano(ano);
  }
}
