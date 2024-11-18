import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParcelasService } from '../../shared/services/parcelas.service';
import { Parcela } from '../../shared/models/parcela';
import { CommonModule } from '@angular/common';
import { Despesa } from '../../shared/models/despesa';
import { DespesasService } from '../../shared/services/despesas.service';
import { DefineCorParcela } from '../../utils/functions/defineCorParcela';
import { ToastrService } from 'ngx-toastr';
import { Ano, Mes } from '../../utils/meses';
import { SystemService } from '../../shared/services/system.service';

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
  valotTotal!: number;
  ano!: Ano;
  
  constructor(
    private readonly parcelasService: ParcelasService,
    private readonly despesasService: DespesasService,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
    private readonly systemService: SystemService
  ){
    this.ano = new Ano(this.systemService.ano.valor);
  }

  ngOnInit(): void {
    this.buscaParcelas();
  }

  buscaParcelas(){
    this.valotTotal = 0;

    this.parcelas = [];
    this.parcelasPagas = [];

    this.parcelasService.GetParcelasByMes(this.systemService.mes.valor + 1, this.systemService.ano.valor).subscribe(parcelas => {
      console.log(parcelas)

      parcelas.map( parcela => {
        parcela.DataVencimento = new Date(parcela.DataVencimento);
        
        this.despesasService.GetDespesasById(parcela.DespesaId).subscribe({
          next: (despesa: Despesa) => {
            if(parcela.IsPaga == 1) {
              this.parcelasPagas.push({parcela: parcela, despesa: despesa});
            }
            else {
              this.parcelas.push({parcela: parcela, despesa: despesa});
              this.valotTotal += parseFloat(parcela.Valor.toString());
            }
          },
          error: (err: any) => {
            if (err.status == 404){
              this.parcelasService.DeleteParcelasByDespesa(parcela.DespesaId).subscribe( x => {
                this.toastrService.warning('Aviso', 'Como essa despesa não foi encontrada, apagamos todas as parcelas referentes a ela.')
              });
            }  
          }
        })
      });
    });
  }
  voltar() {
    this.router.navigate(["home"]);
  }
  DefineCorParcela(parcela: Parcela): string {
    return new Date(parcela.DataVencimento) < new Date()? "#af6e6e" : "#b1ca78";
  }
  mudaMes(mes: Mes){
    this.systemService.mes = mes;
    this.buscaParcelas();
  }
}
