import { Component, Inject, OnChanges, OnInit, SimpleChanges, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Ano, Mes, Meses } from '../../../utils/meses';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Despesa } from '../../../shared/models/despesa';
import { DespesasService } from '../../../shared/services/despesas.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterOutlet } from '@angular/router';
import { ParcelasService } from '../../../shared/services/parcelas.service';
import { Entrada } from '../../../shared/models/entradas';
import { EntradasService } from '../../../shared/services/entradas.service';
import { GetSalarioLiquido } from '../../../utils/functions/salario';
import { ContasService } from '../../../shared/services/contas.service';
import { Conta } from '../../../shared/models/conta';
import { GastosComponent } from '.././gastos/gastos.component';
import { SystemService } from '../../../shared/services/system.service';
import { Cor } from '../../../utils/cores';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { combineLatest, forkJoin } from 'rxjs';
import { DefineCor } from '../../../utils/functions/defineCorGrafico';
import { AgrupamentoTipoDespesa, DespesasMes } from '../../../shared/models/despesasMes';
import { MesGrafico } from '../../../shared/models/graficos';
import { GraficoService } from '../../../shared/services/graficos.service';
import { FormsModule } from '@angular/forms';
import { LogMensal } from '../../../shared/models/logMensal';
import { LogMensalService } from '../../../shared/services/log-mensal.service';

@Component({
  selector: 'app-dados',
  imports: [
        CommonModule,
        FormsModule
    ],
  templateUrl: './dados.component.html',
  styleUrl: './dados.component.css'
})
export class DadosComponent implements OnInit {

  filtro: number = 0;
  despesasMes: DespesasMes[] = [];
  despesasPagas: AgrupamentoTipoDespesa = new AgrupamentoTipoDespesa(this.despesasMes);
  despesasFiltradas: DespesasMes[] = [];
  somaDespesasMes: number = 0;
  despesasParceladas: Despesa[] = [];
  entradas!: Entrada[];
  contas!: Conta[];
  idsPrevisto: number[] = [];
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
  chartMensalOption!: EChartsOption
  aindaPossoGastar!: number
  corGrafico = "#af6e6e";
  anosDeDivida: number[] = [2024, 2025, 2026, 2027];
  totalEntradas: number = 0;
  contasValor: number[] = [];
  graficos!: MesGrafico[];
  mostra: boolean = false;
  contemMenorQZero: boolean = true;
  termo: string = "Todas";
  log: LogMensal = {
    abrevmes: "",
    ano: 0,
    id: 0,
    mes: 0,
    nomemes: "",
    percentgasto: 0,
    valorsaldo: 0
  }

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
    this.ano = new Ano(this.systemService.ano.valor);
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
        this.despesaService.GetDespesasParceladas(mes.valor + 1, ano.valor),
        this.parcelasService.GetParcelasByMes(mes.valor + 1, ano.valor),
        this.despesaService.GetDespesasAdicionais(ano.valor),
        this.parcelasService.GetParcelas(),
        this.entradasService.GetEntradas(),
        this.contasService.GetContaByMes(mes.valor + 1, ano.valor),
        this.contasService.GetContaByMes(mes.valor + 2 > 12? 1: mes.valor + 2, mes.valor + 2 > 12? ano.valor + 1: ano.valor),
        this.contasService.GetContas(),
        this.despesaService.GetDespesasParceladasNaoPagas(mes.valor + 1, ano.valor)
      ]).subscribe({
        next: (success) => {
          this.somaDespesasMes = 0;
          this.despesasMes = []
          this.gastoTotalMes = 0;
          this.idsPrevisto = [];
          this.gastosAdicionais = 0;
          for (let i = 0; i < 12; i++){
            this.systemService.saidas[i] = 0;
          }
          this.aReceber = 0;
          for (let i = 0; i < 12; i++){
            this.systemService.entradas[i] = 0;
          }
          this.saldoAtual = 0;
          this.aindaPossoGastar = 0;
          this.contemMenorQZero = false;
          let aux: {idDespesa: number, valorParcela: number, dataParcela: Date, isPaga: number}[] = [];

          //despesas parceladas
          this.despesasParceladas = success[8];
          this.despesasParceladas.map( x => {
            x.ValorPago = parseFloat(x.ValorPago.toString());
            x.ValorTotal = parseFloat(x.ValorTotal.toString());
          })

          //parcelas do mes
          success[1].map(parcela => {
            parcela.DataVencimento = new Date(parcela.DataVencimento)

            if(parcela.IsPaga == 0 || parcela.IsPaga == 3){
              this.gastoTotalMes += parseFloat(parcela.Valor.toString());
            }

            aux.push({idDespesa: parcela.DespesaId, valorParcela: parcela.Valor, dataParcela: new Date(parcela.DataVencimento), isPaga: parcela.IsPaga})
          });

          //despesas adicionais
          success[2].map(gasto => {
            gasto.DataCompra = new Date(gasto.DataCompra);
            if(!gasto.IsPaga && gasto.DataCompra.getUTCMonth() == mes.valor) {
              this.gastosAdicionais += parseFloat(gasto.ValorTotal.toString());
            }
            this.systemService.saidas[gasto.DataCompra.getUTCMonth()] += parseFloat(gasto.ValorTotal.toString());
            if (gasto.DataCompra.getUTCMonth() == mes.valor){
              try {
                this.despesasMes.push({
                  Nome: gasto.Nome, 
                  Detalhes: gasto.Descricao, 
                  TipoDespesa: gasto.TipoDespesa, 
                  Valor: parseFloat(gasto.ValorTotal.toString()),
                  DataCompra: new Date(gasto.DataCompra),
                  IsPaga: gasto.IsPaga? 1: (gasto.DataCompra < new Date())? 3 : 0 
                });
              }
              catch {
                console.log(gasto);
              }
              this.somaDespesasMes += parseFloat(gasto.ValorTotal.toString());
            }
          });

          //Todas as Parcelas
          success[3].map(parcela => {
            parcela.DataVencimento = new Date(parcela.DataVencimento);
            if(parcela.DataVencimento.getUTCFullYear() == new Date().getUTCFullYear()){
              if(this.systemService.saidas[parcela.DataVencimento.getUTCMonth()]){
                this.systemService.saidas[parcela.DataVencimento.getUTCMonth()] += parseFloat(parcela.Valor.toString());
              }
              else{
                this.systemService.saidas[parcela.DataVencimento.getUTCMonth()] = parseFloat(parcela.Valor.toString());
              }
              if(parcela.DataVencimento < new Date() && parcela.IsPaga == 0){
                parcela.IsPaga = 3;
                this.parcelasService.PutParcela(parcela).subscribe(x => {
                  parcela = x;
                })
              }
            }

          });

          //entradas
          success[4].map(x => {
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

          //contas
          if(success[5].length > 0) {
            success[5].map(x => {
              this.saldoAtual += parseFloat(x.Debito.toString());
            });
          } 
          //calcula saldo do mes
          
          aux.forEach( parcela => {
            const gasto = success[0].find(x => x.Id == parcela.idDespesa);
            try {  
              this.despesasMes.push({
                Nome: gasto!.Nome, 
                Detalhes: gasto!.Descricao, 
                TipoDespesa: gasto!.TipoDespesa, 
                Valor: parseFloat(parcela.valorParcela.toString()),
                DataCompra: new Date(parcela.dataParcela),
                IsPaga: parcela.isPaga
              });
            }
            catch {
              console.log(gasto);
            }
            this.somaDespesasMes += parseFloat(parcela.valorParcela.toString());
          })

          this.aindaPossoGastar = (this.saldoAtual + this.aReceber) - (this.gastoTotalMes + this.gastosAdicionais);
          //definir cor do gráfico de pizza
          this.corGrafico = DefineCor(this.aindaPossoGastar);
          const contas = success[6].sort((a, b) => {return a.Id - b.Id});
          if (contas.length > 0) {
            contas[0].Debito = this.aindaPossoGastar;
            console.log(contas[0])
            if (contas[0].Mes > new Date().getUTCMonth() + 1 || contas[0].Ano > new Date().getUTCFullYear()){
              this.contasService.PutConta(contas[0]).subscribe(x => {});
            }
          } 

          this.despesasFiltradas = this.despesasMes.sort((a,b) => {
            return a.DataCompra.getUTCDate() - b.DataCompra.getUTCDate();
          }).filter(x => x.IsPaga != 1);


          this.despesasPagas = new AgrupamentoTipoDespesa(this.despesasMes
            .filter(x => x.IsPaga == 1)
          );

          success[7].map(conta => {
            if (conta.Ano == ano.valor){
              if (this.contasValor[conta.Mes-1]){
                  this.contasValor[conta.Mes-1] += conta.Debito;
              }
              else {
                this.contasValor[conta.Mes-1] = conta.Debito;
              }
            }
          });

          this.log.abrevmes = mes.nomeAbrev;
          this.log.ano = ano.valor;
          this.log.mes = mes.valor + 1;
          this.log.nomemes = mes.nome;
          this.log.percentgasto = (this.somaDespesasMes*100/this.totalEntradas * 10);
          this.log.valorsaldo = this.saldoAtual;
          this.gravaLog();
        },
        error: (err: any) => {
          this.toastService.error("Error", `Alguma coisa deu errado: ${err.mesage}`);
        }
      });
    });
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

  filtrar(tipoDespesa: string) {
    this.somaDespesasMes = 0
    const tipo = parseInt(tipoDespesa)
    if (tipo > 0) {
      this.despesasFiltradas = this.despesasMes.filter(x => x.TipoDespesa == tipo);
    }
    else {
      this.despesasFiltradas = this.despesasMes;
    }
    this.despesasFiltradas.forEach(x => {
      this.somaDespesasMes += x.Valor;
    });
    this.despesasFiltradas = this.despesasFiltradas.filter(x => !x.IsPaga)
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
    
  defineCorFeed(status: number): string {
    switch (status) {
      case 0: 
        return "rgb(78, 151, 151)";
      case 1: 
        return "#49865b";
      case 3: 
         return "#af6e6e";
    }
    return "";
  }

  filtraPagas(tipo : DespesasMes[]){
    this.despesasFiltradas = tipo;
  }
  DefinirCor(valor: number): any {
    return DefineCor(valor)
  }
  dashboard(){
    this.router.navigate(['dash'])
  }
  filtrarPorTermo(){
    if (this.termo.toLocaleUpperCase() == 'Todas'.toLocaleUpperCase()) {
      this.despesasFiltradas = this.despesasMes;
    }
    else {
      console.log(this.termo)
      this.despesasFiltradas = this.despesasMes.filter(x => { return x.Detalhes.toLocaleUpperCase().includes(this.termo.toLocaleUpperCase());});
    }
  }

  soma(entrada: DespesasMes) {
    this.somaDespesasMes += parseFloat(entrada.Valor.toString());
  }

  zerar(){
    this.somaDespesasMes = 0;
  }

  gravaLog(){
    console.log(this.log);
    if (!(this.log.mes < new Date().getUTCMonth()+ 1 && this.log.ano <= new Date().getUTCFullYear())){
      this.logService.postLog(this.log).subscribe(x => {});
    }
    
  }
  
}

