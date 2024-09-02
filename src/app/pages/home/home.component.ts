import { AfterViewInit, Component, Inject, OnChanges, OnInit, SimpleChanges, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Ano, Mes, Meses } from '../../utils/meses';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Despesa } from '../../shared/models/despesa';
import { DespesasService } from '../../shared/services/despesas.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ParcelasService } from '../../shared/services/parcelas.service';
import { Parcela } from '../../shared/models/parcela';
import { Entrada } from '../../shared/models/entradas';
import { EntradasService } from '../../shared/services/entradas.service';
import { GetSalarioLiquido } from '../../utils/functions/salario';
import { ContasService } from '../../shared/services/contas.service';
import { Conta } from '../../shared/models/conta';
import { GastosComponent } from '../gastos/gastos.component';
import { MensalComponent } from '../../shared/components/mensal/mensal.component';
import { AnualComponent } from '../../shared/components/anual/anual.component';
import { GraficosComponent } from '../../shared/components/graficos/graficos.component';
import { SystemService } from '../../shared/services/system.service';
import { Cor } from '../../utils/cores';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    GastosComponent,
    NgxEchartsDirective
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
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

  constructor(
    @Inject(DOCUMENT) document:Document,
    private readonly despesaService: DespesasService,
    private readonly parcelasService: ParcelasService,
    private readonly entradasService: EntradasService,
    private readonly contasService: ContasService,
    private readonly toastService: ToastrService,
    private readonly router: Router,
    public systemService: SystemService,
    
  ){
    this.ano = new Ano();
  }
  ngAfterViewInit(): void {
    this.mostrarInfo("m");
  }

  ngOnInit(): void {
    this.calculaGastosParcelados();
    this.cauculaGastosAdicionais();
    this.calculaEntradasFuturas();    
    this.calculaSaldoAtual();
    this.calculaTodasParcelas();
  }

  calculaGastosParcelados(){
    this.despesaService.GetDespesasParceladas().subscribe(x => {
      this.despesasParceladas = x;
      this.calculaParcelasdoMes()
    });
  }
  
  calculaParcelasdoMes(){
    this.gastoTotalMes = 0;
    this.idsPrevisto = [];
    this.parcelasService.GetParcelasByMes(this.systemService.mes.valor).subscribe(x => {
      x.map(parcela => {
        parcela.dataVencimento = new Date(parcela.dataVencimento)
        if(parcela.isPaga == 0 || parcela.isPaga == 3){
          this.gastoTotalMes += parcela.valor;
          this.idsPrevisto.push(parcela.id)
        }
      });
    });
  }

  cauculaGastosAdicionais(){
    this.gastosAdicionais = 0;
    this.despesaService.GetDespesasAdicionais().subscribe(x => {
      x.map(gasto => {
        gasto.dataCompra = new Date(gasto.dataCompra);
        if(!gasto.isPaga && gasto.dataCompra.getMonth() + 1 <= this.systemService.mes.valor) {
          this.gastosAdicionais += gasto.valorTotal;
        }
        this.systemService.saidas[gasto.dataCompra.getMonth() + 1] += parseInt(gasto.valorTotal.toString());
      });
    })
  } 
  
  calculaTodasParcelas(){
    this.parcelasService.GetParcelas().subscribe(x => {
      x.map(parcela => {
        parcela.dataVencimento = new Date(parcela.dataVencimento);
        if(parcela.dataVencimento.getFullYear() == new Date().getFullYear()){
          if(this.systemService.saidas[parcela.dataVencimento.getMonth() + 1]){
            this.systemService.saidas[parcela.dataVencimento.getMonth() + 1] += parcela.valor;
          }
          else{
            this.systemService.saidas[parcela.dataVencimento.getMonth() + 1] = parcela.valor;
          }
        }
      });
    });
  }
  
  calculaEntradasFuturas(){
    const dataAtual = new Date()
    this.aReceber = 0;
    this.entradasService.GetEntradas().subscribe({
      next: (success: Entrada[]) => {
        success.map(x => {
          x.dataDebito = new Date(x.dataDebito)
          if ((x.dataDebito.getMonth() + 1 == this.systemService.mes.valor && !x.status)) {
            this.aReceber += GetSalarioLiquido(x.valor)[2].valor; 
          }
          this.systemService.entradas[x.dataDebito.getMonth()] += parseInt(GetSalarioLiquido(x.valor)[2].valor.toString());
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
    this.systemService.mes = mes;
    this.calculaGastosParcelados();
    this.cauculaGastosAdicionais();
    this.calculaEntradasFuturas();    
    this.calculaSaldoAtual();
    this.calculaTodasParcelas();
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
  receber() {
    
  }
  
  mostrarInfo(comp: string){

    switch (comp) {
      case "m": {
        this.definirContainer(MensalComponent);
        this.colorMensal = new Cor().branca;
        this.colorAnual = new Cor().cinza;
        this.colorGrafico = new Cor().cinza;
        break;
      }
      case "a": {
        this.definirContainer(AnualComponent);
        this.colorAnual = new Cor().branca;
        this.colorMensal = new Cor().cinza;
        this.colorGrafico = new Cor().cinza;
        break;
      }
      case "g": {
        this.colorGrafico = new Cor().branca;
        this.colorAnual = new Cor().cinza;
        this.colorMensal = new Cor().cinza;
        this.definirContainer(GraficosComponent);
      }
    }

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
}
