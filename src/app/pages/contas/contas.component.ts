import { Component } from '@angular/core';
import { Conta } from '../../shared/models/conta';
import { ContasService } from '../../shared/services/contas.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './contas.component.html',
  styleUrl: './contas.component.css'
})
export class ContasComponent {
  conta: Conta;
  dataConta: Date
  constructor(
      private readonly contasService: ContasService,
      private readonly router: Router
  ){
      this.conta = {} as Conta;
      this.dataConta = new Date();
  }

  OnSubmit(){
    this.conta.Mes = new Date(this.dataConta).getUTCMonth() + 1;
    this.conta.Ano = new Date(this.dataConta).getUTCFullYear();
    this.contasService.PostConta(this.conta).subscribe({
      next: (success: Conta) => {
         this.router.navigate(["contas-detalhe"]);
      }
    });

  }
  voltar(){
    this.router.navigate(["contas-detalhe"]);
  }
}
