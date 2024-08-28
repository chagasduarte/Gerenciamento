import { Component, OnInit } from '@angular/core';
import { Ano, Mes, Meses } from '../../utils/meses';
import { CommonModule } from '@angular/common';
import { Despesa } from '../../shared/models/despesa';
import { DespesasService } from '../../shared/services/despesas.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ParcelasService } from '../../shared/services/parcelas.service';
import { Parcela } from '../../shared/models/parcela';
import { Entrada } from '../../shared/models/entradas';
import { EntradasService } from '../../shared/services/entradas.service';
import { Salario } from '../../utils/functions/salario';
import { ContasService } from '../../shared/services/contas.service';
import { Conta } from '../../shared/models/conta';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  despesas: Despesa[] = [];
  entradas!: Entrada[];
  contas!: Conta[];
  
  saldoAtual: number = 0;
  aReceber: number = 0;
  gastoTotalMes: number = 0;
  gastosAdicionais: number = 0;

  ano!: Ano;
  mes = new Mes(new Date().getMonth() + 1);
  constructor(
    private readonly despesaService: DespesasService,
    private readonly parcelasService: ParcelasService,
    private readonly entradasService: EntradasService,
    private readonly contasService: ContasService,
    private readonly toastService: ToastrService,
    private readonly router: Router
  ){
    this.ano = new Ano();
  }

  ngOnInit(): void {
    this.calculaGastosDoMes();
    this.calculaEntradasFuturas();    
    this.calculaSaldoAtual();
  }

  calculaGastosDoMes(){
    this.gastoTotalMes = 0;
    this.gastosAdicionais = 0;
    let desp: Despesa[] = [];

    this.despesaService.GetDespesas().subscribe({
      next: (success: Despesa[]) => {
        success.map( x => {
          if (!x.status){
            if (x.isFixa) {
              desp.push(x);
            }
            else {
              if (x.mesCompra == this.mes.valor){
                this.gastosAdicionais += x.valorTotal;
              }
            }
          }
        });
        this.despesas = desp;

        this.despesas.map(x => {        
          this.parcelasService.GetParcelasById(x.id).subscribe({
            next: (success: Parcela[]) => {
              //zera o valor pago e recalcula baseado no status das parcelas.
              x.valorPago = 0;
              success.map(parc => {
              switch (parc.status) {
                case 0: {
                  if (parc.mesVencimento == this.mes.valor) {
                    this.gastoTotalMes += parc.valor;
                  }
                  break;
                }
                case 1: {
                  x.valorPago += parc.valor;
                  break;
                }
              }
              });
            }
          })
        })
      },
      error: (err: any) => {
        this.toastService.error(err.error, "erro", {timeOut: 5000, closeButton: true})
      }
    });
  }

  calculaEntradasFuturas(){
    const dataAtual = new Date()
    this.aReceber = 0;
    this.entradasService.GetEntradas().subscribe({
      next: (success: Entrada[]) => {
        success.map(x => {
          if ((x.mesDebito == this.mes.valor 
               || x.isFixo)
               && x.diaDebito > dataAtual.getDate()) {
            this.aReceber += new Salario().calcularSalarioLiquido(x.valor); 

          }
        })
      }
    })
  }
  
  calculaSaldoAtual(){
    this.saldoAtual = 0;
    this.contasService.GetContas().subscribe({
      next: (success: Conta[]) => {
        success.map(x => {
          this.saldoAtual += x.debito;
        })
      }
    });
  }

  mudaMes(mes: Mes){
    this.mes = mes;
    this.calculaGastosDoMes();
    this.calculaEntradasFuturas();    
    this.calculaSaldoAtual();
  }

  adicionarDespesa() {
    this.router.navigate(["despesas"]);
  }
  AdicionaEntrada() {
    this.router.navigate(["entradas"]);
  }
  parcelas(idDespesa: number) {
    this.router.navigate(["parcelas"], { queryParams: {idDespesa}})
  }
  gastos() {
    this.router.navigate(["gastos"]);
  }
  receber() {
    
  }
    
}
