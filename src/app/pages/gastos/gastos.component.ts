import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DespesasService } from '../../shared/services/despesas.service';
import { Despesa } from '../../shared/models/despesa';
import { Ano, Mes } from '../../utils/meses';
import { Router } from '@angular/router';

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
  mes = new Mes(new Date().getMonth() + 1);

  constructor(
   private readonly despesaService: DespesasService,
   private readonly router: Router
  ){
    this.calculaGastosDoMes()
  }

  calculaGastosDoMes(){
    this.despesaService.GetDespesas().subscribe({
      next: (success: Despesa[]) => {
        this.gastos = success.filter(x => x.mesCompra == this.mes.valor);
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
