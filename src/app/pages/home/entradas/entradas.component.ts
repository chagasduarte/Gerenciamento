import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SystemService } from '../../../shared/services/system.service';
import { TransacaoModel } from '../../../shared/models/despesa.model';
import { TransacoesService } from '../../../shared/services/transacoes.service';

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
    entrada: TransacaoModel;
    dataDebito!: Date
    entradas: string[] = ["Salário SmartHint", "Salário F5", "Benefícios SmartHint", "Benefício F5", "PLR", "Décimo Terceiro", "Recisão", "Seguro Desemprego"];
    
    constructor(
        private readonly entradaService: TransacoesService,
        private readonly router: Router,
        private readonly systemService: SystemService
    ){
        this.entrada = {} as TransacaoModel
    }
    
    OnSubmit(){
      this.entrada.data = new Date(this.dataDebito);

      this.entradaService.PostTransacao(this.entrada).subscribe({
        next: (success: TransacaoModel) => {
           this.router.navigate(["entradas-detalhe"]);
        }
      });
    }


    novaConta(){
      this.router.navigate(["contas", {paginaAnterior: "entradas"}])
    }
}
