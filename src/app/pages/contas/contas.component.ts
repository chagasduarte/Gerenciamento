import { Component, OnInit } from '@angular/core';
import { Conta } from '../../shared/models/conta';
import { ContasService } from '../../shared/services/contas.service';
import { ActivatedRoute, Router } from '@angular/router';
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
export class ContasComponent implements OnInit {
  conta: Conta;
  dataConta: Date;
  listaPessoas: string[] = ["Chagas", "Lu"];
  descricaoConta: string[] = ["Inter", "Itau", "Swile"];
  update: boolean = false;
  paginaAnterior: string = "";

  constructor(
      private readonly contasService: ContasService,
      private readonly router: Router,
      private readonly activeRouter: ActivatedRoute
  ){
      this.conta = {Credito: 0, Debito: 0} as Conta;
      this.dataConta = new Date();
  }
  ngOnInit(): void {
    this.activeRouter.params.subscribe(x => {
      if(x["id"]){
        this.contasService.GetContaById(x["id"]).subscribe(x => {
          this.conta = x;
          this.update = true;
        })
      }
      if(x["paginaAnterior"]){
        this.paginaAnterior = x["paginaAnterior"];
      }
    });
  }

  OnSubmit(){
    this.conta.Mes = new Date(this.dataConta).getUTCMonth() + 1;
    this.conta.Ano = new Date(this.dataConta).getUTCFullYear();
    if(this.update){
      this.contasService.PutConta(this.conta).subscribe({
        next: (success: Conta) => {
           this.router.navigate(["contas-detalhe"]);
        }
      });
    }
    else {
      this.contasService.PostConta(this.conta).subscribe({
        next: (success: Conta) => {
           this.voltar();
        }
      });
    }
  }
  voltar(){
    switch (this.paginaAnterior) {
      case "entradas": 
        this.router.navigate(["entradas"]);
        break;
      case "":
        this.router.navigate(["contas-detalhe"]);
        break;
    }

  }
}
