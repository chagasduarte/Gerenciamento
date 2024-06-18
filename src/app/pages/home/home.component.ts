import { Component, OnInit } from '@angular/core';
import { Ano, Mes, Meses } from '../../utils/meses';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  

  ano!: Ano;
  mes = new Mes(new Date().getMonth() + 1);
  constructor(){
    this.ano = new Ano();
  }

  ngOnInit(): void {
    
  }
  mudaMes(mes: Mes){
    this.mes = mes;
  }
}
