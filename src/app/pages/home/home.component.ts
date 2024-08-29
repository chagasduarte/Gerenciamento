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
import { Salario } from '../../utils/functions/salario';
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
    this.definirContainer(MensalComponent);
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
              if (x.mesCompra == this.systemService.mes.valor){
                this.gastosAdicionais += x.valorTotal;
              }
            }
          }
        });
        this.despesas = desp;

        this.despesas.map(x => {        
          this.parcelasService.GetParcelas(x.id).subscribe({
            next: (success: Parcela[]) => {
              //zera o valor pago e recalcula baseado no status das parcelas.
              x.valorPago = 0;
              success.map(parc => {
              switch (parc.status) {
                case 0: {
                  if (parc.mesVencimento == this.systemService.mes.valor) {
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
          if ((x.mesDebito == this.systemService.mes.valor
               || x.isFixo)) {
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
  parcelas(idDespesa: number) {
    this.router.navigate(["parcelas"], { queryParams: {idDespesa}})
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
        this.colorAnual = new Cor().branca;
        this.colorMensal = new Cor().cinza;
        this.colorGrafico = new Cor().cinza;
        this.definirContainer(AnualComponent);
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
    
}
