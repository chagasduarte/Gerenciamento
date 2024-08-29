import { Component, Input, OnInit, Type } from '@angular/core';
import { Mes } from '../../../utils/meses';
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
  resultados: number[] = []
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
    this.despesaService.GetDespesasByMes(this.systemService.mes.valor).subscribe({
      next: (success: Despesa[]) => {
        success.map( x => {
          if (!x.isFixa){
            this.tabela.map( t => {
              const info = new InfoTabela(x.diaCompra, x.valorTotal, x.nome);
              if (t.Valor == x.tipoDespesa){
                if(t.Info[x.diaCompra+ 1]) {
                  t.Info[x.diaCompra+ 1].detalhe += `- ${x.nome}`
                  t.Info[x.diaCompra+ 1].valor += x.valorTotal;
                }
                else {
                  t.Info[x.diaCompra+ 1] = info;
                }
                this.resultados[x.diaCompra + 1] += x.valorTotal
              }
            });
          }
          else {
            this.parcelaService.GetParcelasByMesAndId(x.id, this.systemService.mes.valor).subscribe({
              next: (success: Parcela[]) => {
                success.map(p => {
                  this.tabela.map(t => {
                    const info = new InfoTabela(p.diaVencimento, p.valor, `Parcela: ${x.nome}`);
                    console.log(info);
                    if(t.Valor == x.tipoDespesa){
                      if(t.Info[p.diaVencimento]) {
                        t.Info[p.diaVencimento].valor += p.valor;
                        this.resultados[p.diaVencimento] += p.valor;
                      }
                      else {
                        t.Info[p.diaVencimento] = info;
                      }                      
                    }
                  })
                })
              }
            })
          }
        });
      },
    });
  }

}
