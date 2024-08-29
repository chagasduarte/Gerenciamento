import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DespesasService } from '../../shared/services/despesas.service';
import { Despesa } from '../../shared/models/despesa';
import { Ano, Mes } from '../../utils/meses';
import { Router } from '@angular/router';
import { SystemService } from '../../shared/services/system.service';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './gastos.component.html',
  styleUrl: './gastos.component.css'
})
export class GastosComponent {


  gastos!: Despesa[]

  ano!: Ano;

  constructor(
   private readonly despesaService: DespesasService,
   private readonly router: Router,
   private readonly systemsService: SystemService
  ){
    this.calculaGastosDoMes()
  }

  calculaGastosDoMes(){
    this.despesaService.GetDespesas().subscribe({
      next: (success: Despesa[]) => {
        this.gastos = success.filter(x => x.mesCompra == this.systemsService.mes.valor);
      },
      error: (err: any) => {

      }
    });
  }

  pagar(despesa: Despesa) {
    despesa.status = true;
    this.despesaService.PutDespesa(despesa).subscribe({
      next: (success: Despesa) => {

      }
    })
  }

  Voltar() {
    this.router.navigate([""]);
  }
}
