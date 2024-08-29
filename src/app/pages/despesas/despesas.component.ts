import { Component } from '@angular/core';
import { Despesa } from '../../shared/models/despesa';
import { DespesasService } from '../../shared/services/despesas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ParcelasService } from '../../shared/services/parcelas.service';
import { ParcelaRequest } from '../../shared/models/parcela';

@Component({
  selector: 'app-despesas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule],
  templateUrl: './despesas.component.html',
  styleUrl: './despesas.component.css'
})
export class DespesasComponent {

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
    

    this.dataCompra = new Date(this.dataCompra);
    this.despesa.tipoDespesa = parseInt(this.despesa.tipoDespesa.toString());
    this.despesa.diaCompra = this.dataCompra.getDate();
    this.despesa.mesCompra = this.dataCompra.getMonth() + 1;
    this.despesa.anoCompra = this.dataCompra.getFullYear();
    this.despesaService.PostDespesa(this.despesa).subscribe({
      next: (success: Despesa) => {
        if (this.despesa.isFixa){
          this.requestParcela.idDespesa = success.id;
          this.requestParcela.dataCompra = this.dataCompra.toISOString().split("T")[0].toString();
          
          this.parcelaService.PostParcela(this.requestParcela).subscribe({
            next: (success: number[]) => {
              this.route.navigate([""]);
            },
            error: (err: any) => {
              this.despesaService.DeleteDespesa(success.id).subscribe({
                next: (success: any) => {
                  console.log(success);
                }
              });
            }
          });
        }        
        else {
          this.route.navigate([""]);
        }
        
      },
      error: (err: any) => {
        this.route.navigate([""]);
      }
    })
  }
}
