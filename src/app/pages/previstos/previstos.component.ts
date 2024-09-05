import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParcelasService } from '../../shared/services/parcelas.service';
import { Parcela } from '../../shared/models/parcela';
import { CommonModule } from '@angular/common';
import { Despesa } from '../../shared/models/despesa';
import { DespesasService } from '../../shared/services/despesas.service';
import { DefineCorParcela } from '../../utils/functions/defineCorParcela';

@Component({
  selector: 'app-previstos',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './previstos.component.html',
  styleUrl: './previstos.component.css'
})
export class PrevistosComponent implements OnInit {

  ids: number[] = [];
  parcelas: {parcela: Parcela, despesa:Despesa}[] = [];
  parcelasPagas: {parcela: Parcela, despesa:Despesa}[] = [];
  corParcela = "#be5232";


  constructor(
    private readonly activeRoute: ActivatedRoute,
    private readonly parcelasService: ParcelasService,
    private readonly despesasService: DespesasService,
    private readonly router: Router
  ){
    this.activeRoute.queryParamMap.subscribe(x => {
      x.keys.map(id => this.ids.push(parseInt(x.get(id)!.toString())))
    });
  }

  ngOnInit(): void {
    this.buscaParcelas();
  }

  buscaParcelas(){
    this.ids.forEach(id => {
      this.parcelasService.GetParcela(id).subscribe(parcela => {
        parcela.dataVencimento = new Date(parcela.dataVencimento);
        
        this.despesasService.GetDespesasById(parcela.despesaId).subscribe(despesa => {
          if(parcela.isPaga) {
            this.parcelasPagas.push({parcela: parcela, despesa: despesa});
          }
          else {
            this.parcelas.push({parcela: parcela, despesa: despesa});
          }
        })
      })
    });
  }
  voltar() {
    this.router.navigate(["home"]);
  }
  DefineCorParcela(parcela: Parcela): string {
    return new Date(parcela.dataVencimento) < new Date()? "#af6e6e" : "#b1ca78";
  }
    
}
