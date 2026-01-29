import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../../../shared/services/categoria.service';
import { TransacoesService } from '../../../shared/services/transacoes.service';
import { SystemService } from '../../../shared/services/system.service';
import { Categoria } from '../../../shared/models/categoria.model';
import { TransacaoModel } from '../../../shared/models/despesa.model';
import { NgxEchartsModule, NGX_ECHARTS_CONFIG } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { Subscription, combineLatest } from 'rxjs';

@Component({
  selector: 'app-grade-pagamentos',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './grade-pagamentos.component.html',
  styleUrl: './grade-pagamentos.component.css'
})
export class GradePagamentosComponent implements OnInit, OnDestroy {
  categorias: Categoria[] = [];
  categoriasExibidas: Categoria[] = [];
  transacoes: TransacaoModel[] = [];
  diasDoMes: number[] = [];
  diasExibidos: number[] = [];
  grade: any = {};
  chartOption: EChartsOption = {};
  private sub = new Subscription();

  constructor(
    private categoriaService: CategoriaService,
    private transacoesService: TransacoesService,
    private systemService: SystemService
  ) { }

  ngOnInit(): void {
    this.sub.add(
      combineLatest([
        this.systemService.mes$,
        this.systemService.ano$,
        this.categoriaService.listar()
      ]).subscribe(([mes, ano, categorias]) => {
        this.categorias = categorias;
        this.gerarDias(mes.valor, ano.valor);
        this.carregarDados(mes.valor + 1, ano.valor);
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private gerarDias(mes: number, ano: number): void {
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    this.diasDoMes = Array.from({ length: ultimoDia }, (_, i) => i + 1);
  }

  private carregarDados(mes: number, ano: number): void {
    this.transacoesService.Extrato(1000, mes, ano).subscribe((transacoes) => {
      this.transacoes = transacoes;
      this.processarGrade();
      this.processarGrafico();
    });
  }

  private processarGrade(): void {
    const novaGrade: any = {};
    const categoriasComSaida = new Set<number>();
    const diasComSaida = new Set<number>();

    this.categorias.forEach((cat) => {
      novaGrade[cat.id] = {};
    });

    this.transacoes.forEach((t) => {
      if (t.tipo === 'saida') {
        const data = new Date(t.data);
        const dia = data.getDate();

        categoriasComSaida.add(t.categoria);
        diasComSaida.add(dia);

        if (novaGrade[t.categoria]) {
          if (!novaGrade[t.categoria][dia]) {
            novaGrade[t.categoria][dia] = [];
          }
          novaGrade[t.categoria][dia].push(t);
        }
      }
    });

    this.grade = novaGrade;
    this.categoriasExibidas = this.categorias.filter(cat => categoriasComSaida.has(cat.id));
    this.diasExibidos = this.diasDoMes.filter(dia => diasComSaida.has(dia));
  }

  private processarGrafico(): void {
    const labels = this.diasDoMes.map(d => d.toString());
    const dadosSaldo: number[] = [];
    const dadosPagamentos: number[] = [];

    // Para o gráfico, precisamos do saldo inicial do mês ou ir acumulando
    // Como não temos o histórico diário exato de entradas, vamos focar no fluxo diário de saídas e o saldo final esperado

    let acumuladoDiario = 0;

    this.diasDoMes.forEach(dia => {
      const transacoesDoDia = this.transacoes.filter(t => new Date(t.data).getDate() === dia);
      const somaSaidas = transacoesDoDia
        .filter(t => t.tipo === 'saida')
        .reduce((acc, t) => acc + t.valor, 0);
      const somaEntradas = transacoesDoDia
        .filter(t => t.tipo === 'entrada')
        .reduce((acc, t) => acc + t.valor, 0);

      acumuladoDiario += (somaEntradas - somaSaidas);
      dadosSaldo.push(parseFloat(acumuladoDiario.toFixed(2)));
      dadosPagamentos.push(parseFloat(somaSaidas.toFixed(2)));
    });

    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: ['Fluxo Acumulado', 'Total Saídas'],
        textStyle: { color: '#fff' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: { color: '#d1e8ec' }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#d1e8ec' },
        splitLine: { lineStyle: { color: '#0b2e36' } }
      },
      series: [
        {
          name: 'Fluxo Acumulado',
          type: 'line',
          data: dadosSaldo,
          smooth: true,
          color: '#7ac27a',
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'Total Saídas',
          type: 'bar',
          data: dadosPagamentos,
          color: '#ef4444'
        }
      ]
    };
  }

  getTransacoes(catId: number, dia: number): TransacaoModel[] {
    return this.grade[catId] && this.grade[catId][dia] ? this.grade[catId][dia] : [];
  }
}
