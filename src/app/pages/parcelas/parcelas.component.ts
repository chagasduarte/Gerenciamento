import { Component } from '@angular/core';
import { ContasService } from '../../shared/services/contas.service';
import { ActivatedRoute, Route, Router, RouterLinkActive } from '@angular/router';
import { ParcelasService } from '../../shared/services/parcelas.service';
import { Parcela } from '../../shared/models/parcela';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(
      private readonly parcelasService: ParcelasService,
      private readonly activeRouter: ActivatedRoute,
      private readonly route: Router
  ){
    this.buscaParcelas();
  }
  
  buscaParcelas() {
    this.activeRouter.queryParams.subscribe({
      next: (success: any) => {
        this.parcelasService.GetParcelas(success.idDespesa).subscribe({
            next: (success: Parcela[]) => {
              this.parcelas = success;
            }
          })
      }
    });
  }

  pagar(parcela: Parcela) {
    parcela.status = 1;
    this.parcelasService.PutParcela(parcela).subscribe({
      next: (success: Parcela) => {
        this.buscaParcelas();
      }
    })    
  } 
  
  Voltar() {
    this.route.navigate([""]);
  }
}
