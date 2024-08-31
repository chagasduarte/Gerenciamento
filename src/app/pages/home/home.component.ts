import { AfterViewInit, Component, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
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
import { GetSalarioLiquido } from '../../utils/functions/salario';
import { ContasService } from '../../shared/services/contas.service';
import { Conta } from '../../shared/models/conta';
import { GastosComponent } from '../gastos/gastos.component';
import { MensalComponent } from '../../shared/components/mensal/mensal.component';
import { AnualComponent } from '../../shared/components/anual/anual.component';
import { GraficosComponent } from '../../shared/components/graficos/graficos.component';
import { SystemService } from '../../shared/services/system.service';
import { Cor } from '../../utils/cores';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    GastosComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit{

  @ViewChild('container', { read: ViewContainerRef }) container!: ViewContainerRef;
  despesas: Despesa[] = [];
  entradas!: Entrada[];
  contas!: Conta[];
  
  saldoAtual: number = 0;
  aReceber: number = 0;
  gastoTotalMes: number = 0;
  gastosAdicionais: number = 0;

  ano!: Ano;
  colorMensal = new Cor().branca;
  colorAnual = "#768da1";
  colorGrafico = "#768da1";

  constructor(
    private readonly despesaService: DespesasService,
    private readonly parcelasService: ParcelasService,
    private readonly entradasService: EntradasService,
    private readonly contasService: ContasService,
    private readonly toastService: ToastrService,
    private readonly router: Router,
    public systemService: SystemService
  ){
    this.ano = new Ano();
  }
  ngAfterViewInit(): void {
    this.mostrarInfo("m")
  }

  ngOnInit(): void {
    this.calculaGastosDoMes();
    this.calculaEntradasFuturas();    
    this.calculaSaldoAtual();
  }

  calculaGastosDoMes(){
    for(let i = 1; i <= 12; i++) {
      this.systemService.entradas[i] = 0;
      this.systemService.saidas[i] = 0;
    }
    this.gastoTotalMes = 0;
    this.gastosAdicionais = 0;
    let desp: Despesa[] = [];

    this.despesaService.GetDespesas().subscribe({
      next: (success: Despesa[]) => {
        success.map( x => {
          x.dataCompra = new Date(x.dataCompra)
          if (!x.isPaga){
            if (x.isParcelada) {
              desp.push(x);
            }
            else {
              if (x.dataCompra.getMonth() + 1 == this.systemService.mes.valor && x.dataCompra.getFullYear() == 2024){
                this.gastosAdicionais += x.valorTotal;
              }
            }
          }
          if (x.dataCompra.getFullYear() == 2024 && !x.isParcelada){
            this.systemService.saidas[x.dataCompra.getMonth()] += parseInt(x.valorTotal.toString());
          }
        });
        this.despesas = desp;

        this.despesas.map(x => {        
          this.parcelasService.GetParcelas(x.id).subscribe({
            next: (success: Parcela[]) => {
              //zera o valor pago e recalcula baseado no status das parcelas.
              x.valorPago = 0;
              success.map(parc => {
                parc.dataVencimento = new Date(parc.dataVencimento)
                switch (parc.isPaga) {
                  case 0: {
                    if (parc.dataVencimento.getMonth() + 1 == this.systemService.mes.valor && parc.dataVencimento.getFullYear() == 2024) {
                      this.gastoTotalMes += parc.valor;
                    }
                    break;
                  }
                  case 1: {
                    x.valorPago += parc.valor;
                    break;
                  }
                }
                if (parc.dataVencimento.getFullYear() == 2024) {
                  this.systemService.saidas[parc.dataVencimento.getMonth()] += parseInt(parc.valor.toString());
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
          x.dataDebito = new Date(x.dataDebito)
          if ((x.dataDebito.getMonth() + 1 == this.systemService.mes.valor && !x.status)) {
            this.aReceber += GetSalarioLiquido(x.valor)[2].valor; 
          }
          this.systemService.entradas[x.dataDebito.getMonth()+1] += parseInt(x.valor.toString());
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
    this.calculaGastosDoMes();
    this.calculaEntradasFuturas();    
    this.calculaSaldoAtual();
    this.mostrarInfo("m")
  }

  adicionarDespesa() {
    this.router.navigate(["despesas"]);
  }
  AdicionaEntrada() {
    this.router.navigate(["entradas"]);
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
}
