import { Component } from '@angular/core';
import { Despesa } from '../../../shared/models/despesa';
import { DespesasService } from '../../../shared/services/despesas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ParcelasService } from '../../../shared/services/parcelas.service';
import { ParcelaRequest } from '../../../shared/models/parcela';
import { ContasService } from '../../../shared/services/contas.service';
import { Conta } from '../../../shared/models/conta';
import { FormataDespesa } from '../../../utils/functions/despesa';

@Component({
    selector: 'app-despesas',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './despesas.component.html',
    styleUrl: './despesas.component.css'
})
export class DespesasComponent {
  contas: Conta[] = []
  despesa: Despesa;
  requestParcela: ParcelaRequest; 

  dataCompra: Date = new Date();

  constructor(
    private readonly despesaService: DespesasService,
    private readonly parcelaService: ParcelasService,
    private readonly route: Router             
  ){
    this.despesa = {} as Despesa;
    this.requestParcela = {} as ParcelaRequest;
  }
  OnSubmit() {
    this.despesa.DataCompra = new Date(this.dataCompra);
    this.despesa.TipoDespesa = parseInt(this.despesa.TipoDespesa.toString());
    this.despesaService.PostDespesa(this.despesa).subscribe({
      next: (success: Despesa) => {
        if (this.despesa.IsParcelada){
          this.requestParcela.IdDespesa = success.Id;
          this.requestParcela.DataCompra = this.despesa.DataCompra.toISOString().split("T")[0] + "T12:00:00.000Z";        
          this.parcelaService.PostParcela(this.requestParcela).subscribe({
            next: (success: number[]) => {
              this.route.navigate(["home"]);
            },
            error: (err: any) => {
              this.despesaService.DeleteDespesa(success.Id).subscribe();
            }
          });
        }        
        else {
          this.route.navigate(["home"]);
        }
        
      },
      error: (err: any) => {
        this.route.navigate(["home"]);
      }
    })
  }
}
