import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SystemService } from '../../services/system.service';
import { Despesas, InfoTabela, TipoDespesa } from '../../models/tipoDespesa';
import { DespesasService } from '../../services/despesas.service';
import { Despesa } from '../../models/despesa';
import { ParcelasService } from '../../services/parcelas.service';
import { Parcela } from '../../models/parcela';

@Component({
  selector: 'app-mensal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './mensal.component.html',
  styleUrl: './mensal.component.css'
})
export class MensalComponent implements OnInit{

  tabela: Despesas[] = [];
  resultados: number[] = [];

  constructor(
    public systemService: SystemService,
    private readonly despesaService: DespesasService,
    private readonly parcelaService: ParcelasService
  ){
    for (const key in TipoDespesa){
      if (!isNaN(Number(key))) {
        const valor = TipoDespesa[key];
        const tab = {Nome: valor, Valor: parseInt(key), Info: [{}] as InfoTabela[]} as Despesas;
        this.tabela.push(tab);
      }
    }
    this.systemService.mes.dias.forEach(x => {
      this.resultados[x.diaMes] = 0;
    })

  }

  ngOnInit(): void {
    this.calculaDespesasMes();
  }

  calculaDespesasMes() {
    this.despesaService.GetDespesasByMes(this.systemService.mes.valor).subscribe(
      x => {
        x.map( x => {
          x.dataCompra = new Date(x.dataCompra);
          if (!x.isParcelada){
            this.tabela.map( t => {
              const info = new InfoTabela(x.dataCompra.getDate(), x.valorTotal, x.nome);
              if (t.Valor == x.tipoDespesa){
                if(t.Info[x.dataCompra.getDate()]) {
                  t.Info[x.dataCompra.getDate()].detalhe += `- ${x.nome}`
                  t.Info[x.dataCompra.getDate()].valor += x.valorTotal;
                }
                else {
                  t.Info[x.dataCompra.getDate()] = info;
                  t.Info[x.dataCompra.getDate()].cor = x.isPaga?"#60b566":"#ffbf33";
                }
                this.resultados[x.dataCompra.getDate()] += x.valorTotal
              }
            });
          }
          else {
            this.getParcelasByMesAndId(x);
          }
        });
      })
  }

  getParcelasByMesAndId(x: Despesa){
    this.parcelaService.GetParcelasByMesAndId(x.id, this.systemService.mes.valor).subscribe({
      next: (success: Parcela[]) => {
        success.map(p => {
          p.dataVencimento = new Date(p.dataVencimento);
          if (p.dataVencimento < new Date() && p.isPaga == 0){
            p.isPaga = 3;
          }
          this.tabela.map(t => {
            const info = new InfoTabela(p.dataVencimento.getDate(), p.valor, `Parcela: ${x.nome}`);
            if(t.Valor == x.tipoDespesa){
              if(t.Info[p.dataVencimento.getDate()]) {
                t.Info[p.dataVencimento.getDate()].valor += p.valor;
                t.Info[p.dataVencimento.getDate()].detalhe += ` | ${x.nome}`
              }
              else {
                t.Info[p.dataVencimento.getDate()] = info;
                let cor:string = "";
                switch(p.isPaga){
                  case 0: 
                    cor = "#ffbf33";
                    break;
                  case 1:
                    cor = "#60b566";
                    break;
                  case 3: 
                    cor = "#ff4d33";
                    break;
                }
                t.Info[p.dataVencimento.getDate()].cor = cor;
              }                      
              this.resultados[p.dataVencimento.getDate()] += p.valor;
            }
          });
        })
      }
    })
  }
}
