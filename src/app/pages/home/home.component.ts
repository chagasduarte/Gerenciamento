import { Component, OnInit } from '@angular/core';
import { Ano, Mes, Meses } from '../../utils/meses';
import { CommonModule } from '@angular/common';
import { Despesa } from '../../shared/models/despesa';
import { DespesasService } from '../../shared/services/despesas.service';
import { ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  despesas!: Despesa[];
  valorMaximo: number = 0;
  gastoTotalMes: number = 0;
  ano!: Ano;
  mes = new Mes(new Date().getMonth() + 1);
  constructor(
    private readonly despesaService: DespesasService,
    private readonly toastService: ToastrService,
    private readonly router: Router
  ){
    this.ano = new Ano();
  }

  ngOnInit(): void {
    this.despesaService.GetDespesasFixas().subscribe({
      next: (success: Despesa[]) => {
        this.gastoTotalMes = 0;
        this.despesas = success;
        this.despesas.map(x => {
          this.gastoTotalMes += x.valorTotal;
          if (x.valorTotal > this.valorMaximo) {
            this.valorMaximo = x.valorTotal;
          }
        })
      },
      error: (err: any) => {
        this.toastService.error(err.error, "erro", {timeOut: 5000, closeButton: true})
      }
    });
  }
  mudaMes(mes: Mes){
    this.mes = mes;
  }

  adicionarDespesa() {
    this.router.navigate(["despesas"]);
  }
}
