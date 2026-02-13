import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Parcela } from '../../../shared/models/parcela';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Conta } from '../../../shared/models/conta';
import { ToastrService } from 'ngx-toastr';
import { Despesa } from '../../../shared/models/despesa';
import { SystemService } from '../../../shared/services/system.service';
import { Pagamento } from '../../../shared/models/pagamentos';
import { TransacaoModel, Transacoes } from '../../../shared/models/despesa.model';
import { TransacoesService } from '../../../shared/services/transacoes.service';
import { forkJoin, lastValueFrom } from 'rxjs';
import { Ano } from '../../../utils/meses';

export interface GroupedParcelas {
  mesAno: string;
  transacoes: TransacaoModel[];
  total: number;
}

@Component({
  selector: 'app-parcelas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './parcelas.component.html',
  styleUrl: './parcelas.component.css'
})
export class ParcelasComponent implements OnInit {

  ano!: Ano;

  parcelas: TransacaoModel[] = [];
  parcelasPagas: TransacaoModel[] = [];
  groupedParcelas: GroupedParcelas[] = [];

  contas!: Conta[];
  idConta: number = 1;
  listaPagamento: TransacaoModel[] = [];
  nomeDespesa!: string;
  despesa!: Despesa;
  totalPagar: number = 0;
  pagamentos: Pagamento[] = [];
  mostrarSelecionadas = false;
  somaAbertos: number = 0;
  somaPagos: number = 0;
  constructor(
    private readonly activeRouter: ActivatedRoute,
    private readonly route: Router,
    private readonly toastr: ToastrService,
    private readonly systemService: SystemService,
    private readonly transacoesService: TransacoesService
  ) {

  }
  ngOnInit(): void {
    this.ano = this.systemService.ano;
    this.buscaParcelas();
  }

  buscaParcelas() {
    this.activeRouter.queryParams.subscribe({
      next: (success: any) => {
        this.nomeDespesa = success.descricao
        this.transacoesService.GetParcelas(this.nomeDespesa).subscribe(x => {
          this.parcelasPagas = x.despesa.filter(x => x.status == 'pago');
          this.parcelas = x.despesa.filter(x => x.status == 'pendente');

          this.somaAbertos = this.parcelas.reduce((acc, p) => acc + parseFloat(p.valor.toString()), 0);
          this.somaPagos = this.parcelasPagas.reduce((acc, p) => acc + parseFloat(p.valor.toString()), 0);

          this.groupAndSortParcelas([...this.parcelas, ...this.parcelasPagas]);
        });
      }
    });
  }

  groupAndSortParcelas(allParcelas: TransacaoModel[]) {
    // Sort all by date first
    allParcelas.sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

    const groups: { [key: string]: GroupedParcelas } = {};
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    allParcelas.forEach(p => {
      const date = new Date(p.data);
      const key = `${meses[date.getUTCMonth()]} ${date.getUTCFullYear()}`;

      if (!groups[key]) {
        groups[key] = {
          mesAno: key,
          transacoes: [],
          total: 0
        };
      }
      groups[key].transacoes.push(p);
      groups[key].total += parseFloat(p.valor.toString());
    });

    // Convert back to array and ensure groups are chronological
    this.groupedParcelas = Object.values(groups).sort((a, b) => {
      const dateA = this.parseMesAno(a.mesAno);
      const dateB = this.parseMesAno(b.mesAno);
      return dateA.getTime() - dateB.getTime();
    });
  }

  private parseMesAno(mesAno: string): Date {
    const [mesNome, ano] = mesAno.split(' ');
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const mesIndex = meses.indexOf(mesNome);
    return new Date(parseInt(ano), mesIndex, 1);
  }

  async pagar() {
    if (this.listaPagamento.length === 0) return;

    try {
      const promises = this.listaPagamento.map(item =>
        lastValueFrom(this.transacoesService.PutEntrada(item.id))
      );

      await Promise.all(promises);

      this.toastr.success("Despesas pagas");
      this.systemService.atualizarResumo();
      this.buscaParcelas();
      this.totalPagar = 0;
      this.listaPagamento = [];
    } catch (error) {
      console.error(error);
      this.toastr.error("Erro ao pagar despesas");
    }
  }
  async apagarDespesaCompleta() {
    if (this.parcelas.length === 0) return;
    try {
      const promise = this.parcelas.map(item =>
        lastValueFrom(this.transacoesService.DeleteTransacao(item.id))
      );
      await Promise.all(promise);
      this.toastr.success("Parcelas Deletadas");
      this.systemService.atualizarResumo();
      this.buscaParcelas();
      this.totalPagar = 0;
    } catch (error) {
      console.error(error);
      this.toastr.error("Erro ao pagar despesas");
    }
  }
  apagar(id: number) {
    this.transacoesService.DeleteTransacao(id).subscribe(x => {
      this.toastr.success("Parcela deletada!");
      this.systemService.atualizarResumo();
      this.buscaParcelas();
    })
  }

  adicionarListaPagamento(despesa: TransacaoModel) {
    this.totalPagar += parseFloat(despesa.valor.toString());
    this.listaPagamento.push(despesa);
    despesa.adicionada = true;
  }

  removedaListaPagamento(despesa: TransacaoModel) {
    this.totalPagar -= parseFloat(despesa.valor.toString());
    this.listaPagamento = this.listaPagamento.filter(x => x.id != despesa.id);
    despesa.adicionada = false;
  }

  Voltar() {
    this.route.navigate(["home"]);
  }


  abrirSelecionadas() {
    this.mostrarSelecionadas = !this.mostrarSelecionadas;
  }

  DefineCorParcela(parcela: Date): string {
    return new Date(parcela) < new Date() ? "#af6e6e" : "#b1ca78";
  }

  atualizarData(parcela: TransacaoModel) {
    this.transacoesService.UpdateTransacao(parcela.id, parcela).subscribe({
      next: () => {
        this.toastr.success("Data atualizada!");
        this.systemService.atualizarResumo();
        this.buscaParcelas();
      },
      error: (err) => {
        this.toastr.error("Erro ao atualizar data");
        console.error(err);
      }
    });
  }
}
