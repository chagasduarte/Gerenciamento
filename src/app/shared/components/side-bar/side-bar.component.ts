import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SystemService } from '../../services/system.service';
import { Ano } from '../../../utils/meses';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  anosDeDivida: number[] = [2024, 2025, 2026];

  constructor(private readonly router: Router, private readonly systemService: SystemService){}
  Home(){
    this.router.navigate(["home"]);
  }
  DashBoard(){
    this.router.navigate(["dash"]);
  }

  Previstos(){
    this.router.navigate(["previstos"]);
  }

  mudaAno(ano: number){
    this.systemService.ano = new Ano(ano);
  }

}
