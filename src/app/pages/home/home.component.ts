import { Component, Inject, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Ano, Mes, Meses } from '../../utils/meses';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Despesa } from '../../shared/models/despesa';
import { DespesasService } from '../../shared/services/despesas.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ParcelasService } from '../../shared/services/parcelas.service';
import { Entrada } from '../../shared/models/entradas';
import { EntradasService } from '../../shared/services/entradas.service';
import { GetSalarioLiquido } from '../../utils/functions/salario';
import { ContasService } from '../../shared/services/contas.service';
import { Conta } from '../../shared/models/conta';
import { GastosComponent } from '../gastos/gastos.component';
import { SystemService } from '../../shared/services/system.service';
import { Cor } from '../../utils/cores';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { forkJoin } from 'rxjs';
import { DefineCor } from '../../utils/functions/defineCorGrafico';
import { AgrupamentoTipoDespesa, DespesasMes } from '../../shared/models/despesasMes';
import { MesGrafico } from '../../shared/models/graficos';
import { GraficoService } from '../../shared/services/graficos.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    GastosComponent,
    NgxEchartsDirective,
    NgxSpinnerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
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
  anosDeDivida: number[] = [2024, 2025, 2026];
  totalEntradas: number = 0;
  contasValor: number[] = [];
  graficos!: MesGrafico[];
  mostra: boolean = false;
  contemMenorQZero: boolean = true;


  constructor(
    @Inject(DOCUMENT) document:Document,
    private readonly despesaService: DespesasService,
    private readonly parcelasService: ParcelasService,
    private readonly entradasService: EntradasService,
    private readonly contasService: ContasService,
    private readonly toastService: ToastrService,
    private readonly router: Router,
    public systemService: SystemService,
    private readonly graficosService: GraficoService
  ){
    this.ano = new Ano(this.systemService.ano.valor);
  }

  ngOnInit(): void { 
    this.preencheInformacoes();
  }
  
  preencheInformacoes(){
    this.totalEntradas = 0;
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
    forkJoin([
      this.despesaService.GetDespesasParceladas(this.systemService.mes.valor + 1, this.systemService.ano.valor),
      this.parcelasService.GetParcelasByMes(this.systemService.mes.valor + 1, this.systemService.ano.valor),
      this.despesaService.GetDespesasAdicionais(this.systemService.ano.valor),
      this.parcelasService.GetParcelas(),
      this.entradasService.GetEntradas(),
      this.contasService.GetContaByMes(this.systemService.mes.valor + 1, this.systemService.ano.valor),
      this.contasService.GetContaByMes(this.systemService.mes.valor + 2 > 12? 1: this.systemService.mes.valor + 2, this.systemService.mes.valor + 2 > 12? this.systemService.ano.valor + 1: this.systemService.ano.valor),
      this.contasService.GetContas(),
      this.graficosService.GetGraficos(this.systemService.ano.valor)
    ]).subscribe({
      next: (success) => {
        let aux: {idDespesa: number, valorParcela: number, dataParcela: Date, isPaga: number}[] = [];

        //despesas parceladas
        this.despesasParceladas = success[0];

        //parcelas do mes
        success[1].map(parcela => {
          parcela.dataVencimento = new Date(parcela.dataVencimento)

          if(parcela.isPaga == 0){
            this.gastoTotalMes += parcela.valor;
          }
          if (parcela.isPaga != 3) {
            this.idsPrevisto.push(parcela.id)
          }
          aux.push({idDespesa: parcela.despesaId, valorParcela: parcela.valor, dataParcela: new Date(parcela.dataVencimento), isPaga: parcela.isPaga})
        });

        //despesas adicionais
        success[2].map(gasto => {
          gasto.dataCompra = new Date(gasto.dataCompra);
          if(!gasto.isPaga && gasto.dataCompra.getUTCMonth() == this.systemService.mes.valor) {
            this.gastosAdicionais += gasto.valorTotal;
          }
          this.systemService.saidas[gasto.dataCompra.getUTCMonth()] += gasto.valorTotal;
          if (gasto.dataCompra.getUTCMonth() == this.systemService.mes.valor){
            this.despesasMes.push({
              nome: gasto.nome, 
              detalhes: gasto.descricao, 
              tipoDespesa: gasto.tipoDespesa, 
              valor: gasto.valorTotal,
              dataCompra: new Date(gasto.dataCompra),
              isPaga: gasto.isPaga? 1: (gasto.dataCompra < new Date())? 3 : 0 
            });
            this.somaDespesasMes += gasto.valorTotal;
          }
        });

        //Todas as Parcelas
        success[3].map(parcela => {
          parcela.dataVencimento = new Date(parcela.dataVencimento);
          if(parcela.dataVencimento.getUTCFullYear() == new Date().getUTCFullYear()){
            if(this.systemService.saidas[parcela.dataVencimento.getUTCMonth()]){
              this.systemService.saidas[parcela.dataVencimento.getUTCMonth()] += parcela.valor;
            }
            else{
              this.systemService.saidas[parcela.dataVencimento.getUTCMonth()] = parcela.valor;
            }
            //busca parcelas atrasadas
            if(parcela.isPaga == 3 && (new Date().getUTCMonth() == this.systemService.mes.valor || parcela.dataVencimento.getUTCMonth() == this.systemService.mes.valor)){
              this.gastoTotalMes += parcela.valor;
              this.idsPrevisto.push(parcela.id)
            }
            
          }

        });

        //entradas
        success[4].map(x => {
          x.dataDebito = new Date(x.dataDebito);

          if (x.dataDebito.getUTCFullYear() == this.systemService.ano.valor) {
            if (x.dataDebito.getUTCMonth() == this.systemService.mes.valor) {
              if ( !x.status) {
                this.aReceber += x.isFixo? GetSalarioLiquido(x.valor)[2].valor: x.valor;

              }
              this.totalEntradas += x.valor;
            }
            
            this.systemService.entradas[x.dataDebito.getUTCMonth()] += x.isFixo? GetSalarioLiquido(x.valor)[2].valor: x.valor;
          }
        });

        //contas
        success[5].map(x => {
          this.saldoAtual += x.debito;
        });

        //calcula saldo do mes
        this.aindaPossoGastar = (this.saldoAtual + this.aReceber) - (this.gastoTotalMes + this.gastosAdicionais);
        const contas = success[6].sort((a, b) => {return b.id - a.id});
        if (contas) {
          contas[0].debito = this.aindaPossoGastar;
          if (contas[0].mes > new Date().getUTCMonth() + 1 || contas[0].ano > new Date().getUTCFullYear()){
            this.contasService.PutConta(contas[0]).subscribe(x => {});
          }
        } 
        aux.forEach( parcela => {
          const gasto = success[0].find(x => x.id == parcela.idDespesa);
          this.despesasMes.push({
            nome: gasto!.nome, 
            detalhes: gasto!.descricao, 
            tipoDespesa: gasto!.tipoDespesa, 
            valor: parcela.valorParcela,
            dataCompra: new Date(parcela.dataParcela),
            isPaga: parcela.isPaga
          });
          this.somaDespesasMes += parcela.valorParcela;
        })

        //definir cor do gráfico de pizza
        this.corGrafico = DefineCor(this.aindaPossoGastar);


        this.despesasFiltradas = this.despesasMes.sort((a,b) => {
          return a.dataCompra.getUTCDate() - b.dataCompra.getUTCDate();
        }).filter(x => x.isPaga != 1);


        this.despesasPagas = new AgrupamentoTipoDespesa(this.despesasMes
          .filter(x => x.isPaga == 1)
        );

        success[7].map(conta => {
          if (conta.ano == this.systemService.ano.valor){
            if (this.contasValor[conta.mes-1]){
                this.contasValor[conta.mes-1] += conta.debito;
            }
            else {
              this.contasValor[conta.mes-1] = conta.debito;
            }
          }
        });
        this.graficos = success[8].meses.sort((a,b) => {return a.id - b.id});
        success[8].meses.map( x => {
          if (this.systemService.ano.maiorValor < Math.abs(x.progressao)){
            this.systemService.ano.maiorValor = Math.abs(x.progressao);
          }
          if (x.progressao < 0){
            this.contemMenorQZero = true;
          }
        })
      },
      error: (err: any) => {
        this.toastService.error("Error", `Alguma coisa deu errado: ${err.mesage}`);
      }
    })
  }


  mudaMes(mes: Mes){
    this.systemService.mes = mes;
    this.preencheInformacoes();
  }

  adicionarDespesa() {
    this.router.navigate(["despesas"]);
  }

  parcelas(despesa: Despesa) {
    this.router.navigate(["parcelas"], { queryParams: {id: despesa.id, nome: despesa.nome}})
  }
  gastos() {
    this.router.navigate(["gastos"]);
  }

  definirContainer(component: Type<any>) {
    if (this.container) {
      this.container.clear();
      this.container.createComponent(component);
    } else {
      console.error('Container não foi inicializado corretamente.');
    }
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
    this.router.navigate(["previstos"], {queryParams: this.idsPrevisto});
  }

  mudaAno(ano: number) {
    this.systemService.mes = new Mes(0, ano);
    this.systemService.ano = new Ano(ano);
    this.preencheInformacoes();
  }

  filtrar(tipoDespesa: string) {
    this.somaDespesasMes = 0
    const tipo = parseInt(tipoDespesa)
    if (tipo > 0) {
      this.despesasFiltradas = this.despesasMes.filter(x => x.tipoDespesa == tipo);
    }
    else {
      this.despesasFiltradas = this.despesasMes;
    }
    this.despesasFiltradas.forEach(x => {
      this.somaDespesasMes += x.valor;
    });
    this.despesasFiltradas = this.despesasFiltradas.filter(x => !x.isPaga)
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
    }
    return "";
  }
    
  defineCorFeed(status: number): string {
    switch (status) {
      case 0: 
        return "rgba(127, 255, 212, 0.123);";
      case 1: 
        return "rgba(127, 255, 212, 0.123);";
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
    
}
