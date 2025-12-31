import { Component, OnInit } from '@angular/core';
import { TransacaoModel } from '../../models/despesa.model';
import { TransacoesService } from '../../services/transacoes.service';
import { CommonModule } from '@angular/common';
import { SystemService } from '../../services/system.service';
import { combineLatest, forkJoin } from 'rxjs';

@Component({
  selector: 'app-extrato',
  imports: [
    CommonModule
  ],
  templateUrl: './extrato.component.html',
  styleUrl: './extrato.component.css'
})
export class ExtratoComponent implements OnInit{
  transacoes!: TransacaoModel[];

  constructor(
    private readonly transacoesService: TransacoesService,
    private readonly systemService: SystemService
  ){}

  ngOnInit(): void {
    combineLatest([
          this.systemService.ano$,
          this.systemService.mes$
        ]).subscribe(([ano, mes]) => {
          forkJoin([
            this.transacoesService.GetDespesasParceladas(mes.valor + 1, ano.valor),
            this.transacoesService.GetAgrupamento(mes.valor + 1, ano.valor),
          ]).subscribe({
            next: (success) => {
              
            },
            error: (err: any) => {
              
            }
          });
        });
  }

  trackByIndex(index: number) {
    return index;
  }

  defineImagem(tipoDespesa: number): string {
   
    switch(tipoDespesa) {
      case 1:
        return "/assets/img/food-wine-cheese-bread-national-culture-paris.svg";
      case 2:
        return "/assets/img/sport-utility-vehicle.svg";
      case 3: 
        return "/assets/img/health.svg";
      case 4: 
        return "/assets/img/books.svg";
      case 5:
        return "/assets/img/beach.svg";
      case 6:
        return "/assets/img/house-with-garden.svg";
      case 7:
        return "/assets/img/customer-service.svg";
      case 8: 
        return "/assets/img/tools-chainsaw.svg";
      case 9: 
        return "/assets/img/revenue.svg";
    }
    return "";
  }
}
