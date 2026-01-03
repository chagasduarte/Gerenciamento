import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../shared/services/system.service';
import { CommonModule } from '@angular/common';
import { Ano, Mes } from '../../../utils/meses';

@Component({
  selector: 'app-nav-bar',
  imports: [
    CommonModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: [
    './nav-bar.component.css',
    './nav-bar.component.mobile.css'
  ]
})
export class NavBarComponent {
  ano: Ano
  constructor(private readonly systemService: SystemService){
    this.ano = this.systemService.ano;
  }

  mudaMes(mes: Mes) {
    this.systemService.setMes(mes);
  }

}
