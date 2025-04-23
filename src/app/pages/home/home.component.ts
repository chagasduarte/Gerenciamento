import { Component, Inject, OnChanges, OnInit, SimpleChanges, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Ano, Mes, Meses } from '../../utils/meses';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Despesa } from '../../shared/models/despesa';
import { DespesasService } from '../../shared/services/despesas.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterOutlet } from '@angular/router';
import { ParcelasService } from '../../shared/services/parcelas.service';
import { Entrada } from '../../shared/models/entradas';
import { EntradasService } from '../../shared/services/entradas.service';
import { GetSalarioLiquido } from '../../utils/functions/salario';
import { ContasService } from '../../shared/services/contas.service';
import { Conta } from '../../shared/models/conta';
import { GastosComponent } from './gastos/gastos.component';
import { SystemService } from '../../shared/services/system.service';
import { Cor } from '../../utils/cores';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { combineLatest, forkJoin } from 'rxjs';
import { DefineCor } from '../../utils/functions/defineCorGrafico';
import { AgrupamentoTipoDespesa, DespesasMes } from '../../shared/models/despesasMes';
import { MesGrafico } from '../../shared/models/graficos';
import { GraficoService } from '../../shared/services/graficos.service';
import { FormsModule } from '@angular/forms';
import { LogMensal } from '../../shared/models/logMensal';
import { LogMensalService } from '../../shared/services/log-mensal.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterOutlet
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css', './home.component.mobile.css']
})
export class HomeComponent implements OnInit {

  somaDespesasMes: number = 0;
  saldoAtual: number = 0;
  aReceber: number = 0;
  gastoTotalMes: number = 0;
  gastosAdicionais: number = 0;
  entradaTotalMes: number = 0;
  saidaTotalMes: number = 0;
  ano!: Ano;
  colorMensal = new Cor().branca;
  colorAnual = "#768da1";
  colorGrafico = "#768da1";
  aindaPossoGastar!: number
  corGrafico = "#af6e6e";
  anosDeDivida: number[] = [2024, 2025, 2026, 2027];
  totalEntradas: number = 0;
  mostra: boolean = false;
  contemMenorQZero: boolean = true;
 
  totalEmConta: number = 0;

  constructor(
    @Inject(DOCUMENT) document:Document,
    private readonly despesaService: DespesasService,
    private readonly parcelasService: ParcelasService,
    private readonly entradasService: EntradasService,
    private readonly contasService: ContasService,
    private readonly toastService: ToastrService,
    private readonly router: Router,
    public systemService: SystemService,
    private readonly graficosService: GraficoService,
    private readonly logService: LogMensalService
  ){
  }

  ngOnInit(): void { 
    this.preencheInformacoes();
  }
  
  preencheInformacoes(){
    combineLatest([
      this.systemService.ano$,
      this.systemService.mes$
    ]).subscribe(([ano, mes]) => {
      this.ano = ano;
      forkJoin([
        this.contasService.GetContaByMes(mes.valor + 1, ano.valor),
        this.entradasService.GetEntradas(),
        this.parcelasService.GetParcelasByMes(mes.valor + 1, ano.valor),
        this.despesaService.GetDespesasAdicionais(ano.valor),
      ]).subscribe({
        next: (success) => {
          
          this.aReceber = 0;
          this.saldoAtual = 0;
          this.aindaPossoGastar = 0;
          this.gastoTotalMes = 0;
          this.gastosAdicionais = 0;
          let aux: {idDespesa: number, valorParcela: number, dataParcela: Date, isPaga: number}[] = [];

          success[0].forEach( (conta) => {
            this.saldoAtual += parseFloat(conta.Debito.toString());
          });
          success[1].map(x => {
            x.DataDebito = new Date(x.DataDebito);

            if (x.DataDebito.getUTCFullYear() == ano.valor) {
              if (x.DataDebito.getUTCMonth() == mes.valor) {
                if ( !x.Status) {
                  this.aReceber += x.IsFixo? GetSalarioLiquido(parseFloat(x.Valor.toString()))[2].valor: parseFloat(x.Valor.toString());

                }
                this.totalEntradas += parseFloat(x.Valor.toString());
              }
              
              this.systemService.entradas[x.DataDebito.getUTCMonth()] += x.IsFixo? GetSalarioLiquido(parseFloat(x.Valor.toString()))[2].valor: parseFloat(x.Valor.toString());
            }
          });
          
          success[2].map(parcela => {
            parcela.DataVencimento = new Date(parcela.DataVencimento)

            if(parcela.IsPaga == 0 || parcela.IsPaga == 3){
              this.gastoTotalMes += parseFloat(parcela.Valor.toString());
            }

            aux.push({idDespesa: parcela.DespesaId, valorParcela: parcela.Valor, dataParcela: new Date(parcela.DataVencimento), isPaga: parcela.IsPaga})

          });

          success[3].map(gasto => {
            gasto.DataCompra = new Date(gasto.DataCompra);
            if(!gasto.IsPaga && gasto.DataCompra.getUTCMonth() == mes.valor) {
              this.gastosAdicionais += parseFloat(gasto.ValorTotal.toString());
            }
            if (gasto.DataCompra.getUTCMonth() == mes.valor){
              this.somaDespesasMes += parseFloat(gasto.ValorTotal.toString());
            }
          });

          aux.forEach( parcela => {
            this.somaDespesasMes += parseFloat(parcela.valorParcela.toString());
          })

          this.aindaPossoGastar = (this.saldoAtual + this.aReceber) - (this.gastoTotalMes + this.gastosAdicionais);
        }
      })
    });
  }


  mudaMes(mes: Mes){
    this.systemService.setMes(mes);
    this.preencheInformacoes();
  }

  adicionarDespesa() {
    this.router.navigate(["despesas"]);
  }

  parcelas(despesa: Despesa) {
    this.router.navigate(["parcelas"], { queryParams: {id: despesa.Id, nome: despesa.Nome}})
  }
  gastos() {
    this.router.navigate(["gastos"]);
  }

  contasDetalhes() {
    this.router.navigate(["contas-detalhe"])
  }

  entradaDetalhes() {
    this.router.navigate(["entradas-detalhe"])
  }
  parseInt(valor: number) {
    return parseInt(valor.toString());
  }
  previstos() {
    this.router.navigate(["previstos"]);
  }

  mudaAno(ano: number) {
    if (ano < 2024){
      return;
    }
    else if(ano == 2024){
      this.systemService.setMes(new Mes(8, ano));
      if (new Date().getUTCFullYear() == ano){
        this.systemService.setMes(new Mes(new Date().getUTCMonth(), ano));
      }
    }
    else if (new Date().getUTCFullYear() == ano){
      this.systemService.setMes(new Mes(new Date().getUTCMonth(), ano));
    }
    else {
      this.systemService.setMes(new Mes(0, ano));
    }
    this.systemService.setAno(new Ano(ano));
    this.ano = new Ano(ano);
    this.preencheInformacoes();
  }

  dashboard(){
    this.router.navigate(['dash'])
  }
}
