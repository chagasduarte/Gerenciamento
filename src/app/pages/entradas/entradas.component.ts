import { Component, OnInit } from '@angular/core';
import { Entrada } from '../../shared/models/entradas';
import { EntradasService } from '../../shared/services/entradas.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GetSalarioLiquido } from '../../utils/functions/salario';
import { ContasService } from '../../shared/services/contas.service';
import { Conta } from '../../shared/models/conta';
import { SystemService } from '../../shared/services/system.service';

@Component({
  selector: 'app-entradas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './entradas.component.html',
  styleUrl: './entradas.component.css'
})
export class EntradasComponent {
    entrada: Entrada;
    contas!: Conta[];
    dataDebito!: Date
    constructor(
        private readonly entradaService: EntradasService,
        private readonly contasService: ContasService,
        private readonly router: Router,
        private readonly systemaService: SystemService
    ){
        this.entrada = {} as Entrada
        this.contasService.GetContaByMes(new Date().getUTCMonth() + 1).subscribe({
          next: (success: Conta[]) => {
            this.contas = success;
          } 
        })
    }
  
    OnSubmit(){
      this.entrada.dataDebito = new Date(new Date(this.dataDebito).toISOString().split("T")[0] + "T12:00:00.000Z");

      this.entradaService.PostEntrada(this.entrada).subscribe({
        next: (success: Entrada) => {
           this.router.navigate(["entradas-detalhe"]);
        }
      });
    }
}
