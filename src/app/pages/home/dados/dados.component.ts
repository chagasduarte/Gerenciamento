import { Component, OnInit } from '@angular/core';
import { Ano } from '../../../utils/meses';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SystemService } from '../../../shared/services/system.service';
import { combineLatest, forkJoin } from 'rxjs';
import { DefineCor } from '../../../utils/functions/defineCorGrafico';
import { FormsModule } from '@angular/forms';
import { DespesasParceladasResponse } from '../../../shared/models/despesasParceladas.model';
import { AgrupamentoResponse } from '../../../shared/models/agrupamento';
import { TransacoesService } from '../../../shared/services/transacoes.service';
import { TransacaoModel } from '../../../shared/models/despesa.model';
import { PlanejamentoComponent } from "../../../shared/components/planejamento/planejamento.component";
import { GradePagamentosComponent } from '../grade-pagamentos/grade-pagamentos.component';

@Component({
  selector: 'app-dados',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PlanejamentoComponent,
    GradePagamentosComponent
  ],
  templateUrl: './dados.component.html',
  styleUrls: ['./dados.component.css', './dados.component.mobile.css']
})
export class DadosComponent implements OnInit {
  ano!: Ano;
  novasParcelas: DespesasParceladasResponse =
    {
      parcelas: [],
      mensal: {
        pendente: 0
      }
    } as DespesasParceladasResponse;

  resumoMensal$ = this.systemService.resumo$; // <-- é reativo
  novoAgrupamento!: AgrupamentoResponse;

  novaDespesa: TransacaoModel = {
    categoria: 0,
    descricao: '',
    criado_em: new Date(),
    data: new Date(),
    id: 0,
    status: 'pendente',
    tipo: 'saida',
    ispaycart: false,
    valor: 0,
    cartaoid: null,
    pagamento: new Date()
  };
  dataCompra: string = '';
  isCartao: boolean = false;
  isParcelado: boolean = false;

  requestParcela = {
    QtdParcelas: null,
    Valor: null
  };
  constructor(
    private readonly despesaService: TransacoesService,
    private readonly toastService: ToastrService,
    private readonly router: Router,
    public readonly systemService: SystemService,
  ) {
    this.ano = new Ano(this.systemService.ano.valor);
  }

  ngOnInit(): void {
    this.preencheInformacoes();
  }

  preencheInformacoes() {

    combineLatest([
      this.systemService.ano$,
      this.systemService.mes$
    ]).subscribe(([ano, mes]) => {
      this.ano = ano;
      forkJoin([
        this.despesaService.GetDespesasParceladas(mes.valor + 1, ano.valor),
        this.despesaService.GetAgrupamento(mes.valor + 1, ano.valor, 'saida'),
        this.despesaService.GetProjecao(ano.valor)
      ]).subscribe({
        next: (success) => {
          this.novasParcelas = success[0];
          this.novoAgrupamento = success[1];
        },
        error: (err: any) => {

        }
      });
    });
  }

  salvarTransacao() {
    if (this.isParcelado) {
      const payload = {
        ...this.novaDespesa,
        data: new Date(this.dataCompra),
        ispaycart: this.isCartao,
        parcelado: this.isParcelado,
        parcelas: this.isParcelado ? this.requestParcela : null
      };
      this.despesaService.PostTrasacoesParceladas(payload).subscribe({
        next: (success: TransacaoModel[]) => {
          if (success) {
            this.preencheInformacoes();
            this.toastService.success("Parcelas Gravadas");
          }
        },
        error: (err) => {
          this.toastService.error(err.message);
        },
      })
    }
    else {
      this.novaDespesa.data = new Date(this.dataCompra);
      this.novaDespesa.ispaycart = this.isCartao;
      this.despesaService.PostTransacao(this.novaDespesa).subscribe(x => {
        this.preencheInformacoes();
        this.toastService.success("Despesa Gravada");
      });
    }
    this.fecharModal();
  }

  fecharModal() {
    const modal = document.getElementById('addTransacaoModal');
    if (modal) {
      const backdrop = document.querySelector('.modal-backdrop');
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
      modal.style.display = 'none';
      backdrop?.remove();
      document.body.classList.remove('modal-open');
    }
  }
  adicionarDespesa() {
    this.router.navigate(["despesas"]);
  }

  parcelas(descricao: string) {
    this.router.navigate(["parcelas"], { queryParams: { descricao: descricao } })
  }

  gastos() {
    this.router.navigate(["gastos"]);
  }

  contasDetalhes() {
    this.router.navigate(["contas-detalhe"])
  }
  objetivos() { this.router.navigate(['objetivos']); }

  entradaDetalhes() {
    this.router.navigate(["entradas-detalhe"])
  }
  parseInt(valor: number) {
    return parseInt(valor.toString());
  }
  previstos() {
    this.router.navigate(["previstos"]);
  }

  defineImagem(tipoDespesa: number): string {

    switch (tipoDespesa) {
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

  DefinirCor(valor: number): any {
    return DefineCor(valor)
  }
  dashboard() {
    this.router.navigate(['dash'])
  }

}

