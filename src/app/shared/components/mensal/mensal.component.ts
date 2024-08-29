import { Component, Input, OnInit, Type } from '@angular/core';
import { Mes } from '../../../utils/meses';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SystemService } from '../../services/system.service';
import { Despesas, InfoTabela, TipoDespesa } from '../../models/tipoDespesa';
import { DespesasService } from '../../services/despesas.service';
import { Despesa } from '../../models/despesa';

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
  
  constructor(
    public systemService: SystemService,
    private readonly despesaService: DespesasService
  ){
    for (const key in TipoDespesa){
      if (!isNaN(Number(key))) {
      const valor = TipoDespesa[key];
      const tab = {Nome: valor, Valor: parseInt(key), Info: [{}] as InfoTabela[]} as Despesas;
      this.tabela.push(tab);
      }
    }

  }

  ngOnInit(): void {
    this.despesaService.GetDespesasByMes(this.systemService.mes.valor).subscribe({
      next: (success: Despesa[]) => {
        success.map( x => {
          const info = new InfoTabela(x.diaCompra, x.valorTotal, x.descricao);
          this.tabela.map( t => {
            if (t.Valor == x.tipoDespesa){
              t.Info.push(info);
            }
          });
        });
      },
      error: (err: any) => {
        
      }
    });
  }
}
