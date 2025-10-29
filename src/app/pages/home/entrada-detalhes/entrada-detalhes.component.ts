import { Component, OnInit } from '@angular/core';
import { Entrada } from '../../../shared/models/entradas';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GetSalarioLiquido } from '../../../utils/functions/salario';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SystemService } from '../../../shared/services/system.service';
import { Ano } from '../../../utils/meses';
import { combineLatest } from 'rxjs';
import { EntradasResponse } from '../../../shared/models/entradas.model';
import { TransacoesService } from '../../../shared/services/transacoes.service';

@Component({
    selector: 'app-entrada-detalhes',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './entrada-detalhes.component.html',
    styleUrl: './entrada-detalhes.component.css'
})
export class EntradaDetalhesComponent implements OnInit{

 
  ano: Ano;
  
  resumoEntradas!: EntradasResponse;

  constructor(
    private readonly entradaService: TransacoesService,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
    private systemsService: SystemService
  ){
    this.ano = new Ano(this.systemsService.ano.valor);
  }
  ngOnInit(): void {
    this.buscaEntradas();
  }

  buscaEntradas() {
   
    combineLatest([
      this.systemsService.ano$,
      this.systemsService.mes$
    ]).subscribe(([ano, mes]) => {
      this.entradaService.GetEntradas(mes.valor + 1, ano.valor).subscribe( x => {
        this.resumoEntradas = x;
      });
    })
    
  }

  receber(id: number) {
   this.entradaService.PutEntrada(id).subscribe({
    next: (success) => {
      this.toastrService.success("Recebido!!!");
      this.buscaEntradas()
    }
   })
    
  }

  deleteEntrada(id: number){
    this.entradaService.DeleteTransacao(id).subscribe(x => {
      this.toastrService.success("Entrada deletada","OK");
      this.buscaEntradas();
      this.systemsService.atualizarResumo();
    })
  }

  voltar() {
    this.router.navigate(["home"]);
  }
  GetSalarioLiquido(salario: number): any {
    return GetSalarioLiquido(salario);
  }
  AdicionaEntrada() {
    this.router.navigate(["entradas"]);
  }
  deletar(entrada: Entrada){
    
  }
}
