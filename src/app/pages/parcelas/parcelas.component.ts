import { Component } from '@angular/core';
import { ContasService } from '../../shared/services/contas.service';
import { ActivatedRoute, Route, Router, RouterLinkActive } from '@angular/router';
import { ParcelasService } from '../../shared/services/parcelas.service';
import { Parcela } from '../../shared/models/parcela';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conta } from '../../shared/models/conta';

@Component({
  selector: 'app-parcelas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './parcelas.component.html',
  styleUrl: './parcelas.component.css'
})
export class ParcelasComponent {


  parcelas!: Parcela[];
  contas!: Conta[];
  idConta: number = 1;
  listaPagamento: Parcela[] = [];
  nomeDespesa!: string;

  constructor(
      private readonly parcelasService: ParcelasService,
      private readonly activeRouter: ActivatedRoute,
      private readonly contasService: ContasService,
      private readonly route: Router
  ){
    this.buscaParcelas();
    this.buscaContas();
  }
  
  buscaParcelas() {
    this.activeRouter.queryParams.subscribe({
      next: (success: any) => {
        this.nomeDespesa = success.nome
        this.parcelasService.GetParcelas(success.id).subscribe({
            next: (success: Parcela[]) => {
              this.parcelas = success;
            }
          })
      }
    });
  }
  buscaContas(){
    this.contasService.GetContas().subscribe(x => {
      this.contas = x;
    })
  }

  pagar() {
    let cont = this.contas.find(x => x.id == this.idConta);
    if (cont) {
      if (this.listaPagamento.length > 0){
        this.listaPagamento.map( parcela => {
          cont.debito -= parcela.valor;
          this.contasService.PutConta(cont).subscribe({});
          parcela.isPaga = 1;
          this.parcelasService.PutParcela(parcela).subscribe({});
        });    
      }
    }
    
    this.buscaParcelas();
  } 
  adicionaLista(parcela: Parcela){
    if(parcela.isPaga != 3){
      parcela.isPaga = 3;
      this.listaPagamento.push(parcela);
    }
  }
  Voltar() {
    this.route.navigate([""]);
  }
}
