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
      this.contasService.GetContas()
    ]).subscribe({
      next: (success) => {
        let aux: {idDespesa: number, valorParcela: number, dataParcela: Date, isPaga: number}[] = [];

        //despesas parceladas
        this.despesasParceladas = success[0];
        console.log(success[0]);
        //parcelas do mes
        success[1].map(parcela => {
          parcela.DataVencimento = new Date(parcela.DataVencimento)

          if(parcela.IsPaga == 0){
            this.gastoTotalMes += parseFloat(parcela.Valor.toString());
          }
          if (parcela.IsPaga != 3) {
            this.idsPrevisto.push(parcela.Id)
          }
          aux.push({idDespesa: parcela.DespesaId, valorParcela: parcela.Valor, dataParcela: new Date(parcela.DataVencimento), isPaga: parcela.IsPaga})
        });

        //despesas adicionais
        success[2].map(gasto => {
          gasto.DataCompra = new Date(gasto.DataCompra);
          if(!gasto.IsPaga && gasto.DataCompra.getUTCMonth() == this.systemService.mes.valor) {
            this.gastosAdicionais += parseFloat(gasto.ValorTotal.toString());
          }
          this.systemService.saidas[gasto.DataCompra.getUTCMonth()] += parseFloat(gasto.ValorTotal.toString());
          if (gasto.DataCompra.getUTCMonth() == this.systemService.mes.valor){
            this.despesasMes.push({
              Nome: gasto.Nome, 
              Detalhes: gasto.Descricao, 
              TipoDespesa: gasto.TipoDespesa, 
              Valor: parseFloat(gasto.ValorTotal.toString()),
              DataCompra: new Date(gasto.DataCompra),
              IsPaga: gasto.IsPaga? 1: (gasto.DataCompra < new Date())? 3 : 0 
            });
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
            //busca parcelas atrasadas
            if(parcela.IsPaga == 3 && (new Date().getUTCMonth() == this.systemService.mes.valor || parcela.DataVencimento.getUTCMonth() == this.systemService.mes.valor)){
              this.gastoTotalMes += parseFloat(parcela.Valor.toString());
              this.idsPrevisto.push(parcela.Id)
            }
            
          }

        });

        //entradas
        success[4].map(x => {
          x.DataDebito = new Date(x.DataDebito);

          if (x.DataDebito.getUTCFullYear() == this.systemService.ano.valor) {
            if (x.DataDebito.getUTCMonth() == this.systemService.mes.valor) {
              if ( !x.Status) {
                this.aReceber += x.IsFixo? GetSalarioLiquido(parseFloat(x.Valor.toString()))[2].valor: parseFloat(x.Valor.toString());

              }
              this.totalEntradas += parseFloat(x.Valor.toString());
            }
            
            this.systemService.entradas[x.DataDebito.getUTCMonth()] += x.IsFixo? GetSalarioLiquido(parseFloat(x.Valor.toString()))[2].valor: parseFloat(x.Valor.toString());
          }
        });

        //contas
        success[5].map(x => {
          this.saldoAtual += parseFloat(x.Debito.toString());
        });

        //calcula saldo do mes
        this.aindaPossoGastar = (this.saldoAtual + this.aReceber) - (this.gastoTotalMes + this.gastosAdicionais);
        const contas = success[6].sort((a, b) => {return b.Id - a.Id});
        if (contas) {
          contas[0].Debito = this.aindaPossoGastar;
          if (contas[0].Mes > new Date().getUTCMonth() + 1 || contas[0].Ano > new Date().getUTCFullYear()){
            this.contasService.PutConta(contas[0]).subscribe(x => {});
          }
        } 
        aux.forEach( parcela => {
          const gasto = success[0].find(x => x.Id == parcela.idDespesa);
          this.despesasMes.push({
            Nome: gasto!.Nome, 
            Detalhes: gasto!.Descricao, 
            TipoDespesa: gasto!.TipoDespesa, 
            Valor: parseFloat(parcela.valorParcela.toString()),
            DataCompra: new Date(parcela.dataParcela),
            IsPaga: parcela.isPaga
          });
          this.somaDespesasMes += parseFloat(parcela.valorParcela.toString());
        })

        //definir cor do gráfico de pizza
        this.corGrafico = DefineCor(this.aindaPossoGastar);


        this.despesasFiltradas = this.despesasMes.sort((a,b) => {
          return a.DataCompra.getUTCDate() - b.DataCompra.getUTCDate();
        }).filter(x => x.IsPaga != 1);


        this.despesasPagas = new AgrupamentoTipoDespesa(this.despesasMes
          .filter(x => x.IsPaga == 1)
        );

        success[7].map(conta => {
          if (conta.Ano == this.systemService.ano.valor){
            if (this.contasValor[conta.Mes-1]){
                this.contasValor[conta.Mes-1] += conta.Debito;
            }
            else {
              this.contasValor[conta.Mes-1] = conta.Debito;
            }
          }
        });

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
    this.router.navigate(["parcelas"], { queryParams: {id: despesa.Id, nome: despesa.Nome}})
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
