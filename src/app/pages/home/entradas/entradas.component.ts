import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SystemService } from '../../../shared/services/system.service';
import { TransacaoModel } from '../../../shared/models/despesa.model';
import { TransacoesService } from '../../../shared/services/transacoes.service';
import { Mes } from '../../../utils/meses';

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
    fixo!: boolean
    constructor(
        private readonly entradaService: TransacoesService,
        private readonly router: Router,
        private readonly systemService: SystemService
    ){
        this.entrada = {} as TransacaoModel
    }
    
    OnSubmit(){
      this.entrada.data = new Date(this.dataDebito);
      this.entrada.tipo = 'entrada';
      this.entrada.status = 'pendente';
      if (this.fixo) {
        for(let i = this.systemService.mes.valor; i <= 12 ; i++)
        this.entradaService.PostTransacao(this.entrada).subscribe({
          next: (success: TransacaoModel) => {
            this.systemService.atualizarResumo();
            this.router.navigate(["entradas-detalhe"]);
          }
        });
      }
      
    }


    novaConta(){
      this.router.navigate(["contas", {paginaAnterior: "entradas"}])
    }
}
