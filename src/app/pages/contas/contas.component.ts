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

  constructor(
      private readonly contasService: ContasService,
      private readonly router: Router
  ){
      this.conta = {} as Conta;
  }

  OnSubmit(){
    console.log("aqui")
    this.contasService.PostConta(this.conta).subscribe({
      next: (success: Conta) => {
         this.router.navigate([""]);
      }
    });

  }
}
