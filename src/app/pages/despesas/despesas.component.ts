import { Component } from '@angular/core';
import { Despesa } from '../../shared/models/despesa';
import { DespesasService } from '../../shared/services/despesas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-despesas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule],
  templateUrl: './despesas.component.html',
  styleUrl: './despesas.component.css'
})
export class DespesasComponent {

  despesa: Despesa;
  dataCompra: Date = new Date();
  constructor(
    private readonly despesaService: DespesasService,
    private readonly route: Router             
  ){
    this.despesa = {} as Despesa
  }
  OnSubmit() {
    this.dataCompra = new Date(this.dataCompra);
    this.despesa.tipoDespesa = parseInt(this.despesa.tipoDespesa.toString());
    this.despesa.diaCompra = this.dataCompra.getDay();
    this.despesa.mesCompra = this.dataCompra.getMonth();
    this.despesa.anoCompra = this.dataCompra.getFullYear();

    this.despesaService.PostDespesa(this.despesa).subscribe({
      next: (success: Despesa) => {
        this.route.navigate([""]);
      },
      error: (err: any) => {
        this.route.navigate([""]);
      }
    })
  }
}
