import { Component, OnInit } from '@angular/core';
import { Objetivo } from '../../../shared/models/objetivo';
import { ResumoObjetivosComponent } from "../../../shared/components/resumo-objetivos/resumo-objetivos.component";
import { FiltrosObjetivosComponent } from "../../../shared/components/filtros-objetivos/filtros-objetivos.component";
import { CardObjetivosComponent } from '../../../shared/components/card-objetivos/card-objetivos.component';
import { CommonModule } from '@angular/common';
import { ObjetivosService } from '../../../shared/services/objetivos.service';
import { LinhaTemporal } from '../../../shared/models/linha-temporal.model';
import { ToastrService } from 'ngx-toastr';
import { SystemService } from '../../../shared/services/system.service';
import { TransacoesService } from '../../../shared/services/transacoes.service';
import { forkJoin } from 'rxjs';
import { Projecao } from '../../../shared/models/projecao.model';

@Component({
  selector: 'app-objetivos',
  imports: [
    ResumoObjetivosComponent,
    FiltrosObjetivosComponent,
    CardObjetivosComponent,
    CommonModule
  ],
  templateUrl: './objetivos.component.html',
  styleUrl: './objetivos.component.css'
})
export class ObjetivosComponent implements OnInit {
  filtroSelecionado = 'todos';
  despesas: LinhaTemporal[] = [];
  ano$ = this.systemService.ano$;
  objetivos: Objetivo[] = [];
  projecao: Projecao[] = [];

  get objetivosFiltrados() {
    if (this.filtroSelecionado === 'todos') return this.objetivos;
    return this.objetivos.filter(o => o.status === this.filtroSelecionado);
  }

  constructor(
    private readonly objetivosService: ObjetivosService,
    private readonly toastrService: ToastrService,
    private readonly systemService: SystemService,
    private readonly transacao: TransacoesService
  ) { }

  ngOnInit(): void {
    // Busca inicial
    this.carregarDados(this.systemService.ano.valor);

    // Reage a mudanças de ano
    this.ano$.subscribe(ano => {
      this.carregarDados(ano.valor);
    })
  }

  carregarDados(ano: number) {
    forkJoin({
      objetivos: this.objetivosService.listar(),
      linhaTemporal: this.transacao.GetLinhaTemporal(ano),
      projecao: this.transacao.GetProjecao(ano)
    }).subscribe({
      next: (result) => {
        this.objetivos = result.objetivos;
        this.despesas = result.linhaTemporal;
        this.projecao = result.projecao;

        // Após carregar tudo, calcula a sugestão
        this.calcularSugestaoObjetivos();
      },
      error: (err) => {
        console.error(err);
        this.toastrService.error("Erro ao carregar dados da tela de objetivos.");
      }
    });
  }

  mudarFiltro(filtro: string) {
    this.filtroSelecionado = filtro;
  }

  calcularSugestaoObjetivos() {
    // 1. Cria um mapa de saldo disponível por mês (para simulação)
    // Inicializa com o saldo mensal projetado
    const saldosSimulados = new Array(12).fill(0);
    this.projecao.forEach(p => {
      // Ajuste: Projecao pode vir com meses fora de ordem ou incompletos, 
      // mas assumindo que p.mes é 1-12.
      if (p.mes >= 1 && p.mes <= 12) {
        saldosSimulados[p.mes - 1] = p.saldo_mensal;
      }
    });

    // 2. Filtra objetivos que ainda precisam de pagamento
    const objetivosPendentes = this.objetivos.filter(o =>
      o.status !== 'concluido' &&
      (o.valor_objetivo - o.valor_acumulado) > 0
    );

    // Opcional: Ordenar objetivos por prioridade (Curto prazo primeiro) ou valor
    // objetivosPendentes.sort(...)

    objetivosPendentes.forEach(obj => {
      const valorRestante = obj.valor_objetivo - obj.valor_acumulado;
      const parcelasNecessarias = Math.ceil(valorRestante / obj.valor_mensal);

      // Tenta encontrar uma sequencia de meses onde o saldo comporte o valor mensal
      let mesInicio = -1;

      // Algoritmo simples: Procura o primeiro bloco contíguo de meses
      // onde Saldo >= ValorMensal
      for (let i = 0; i <= 12 - parcelasNecessarias; i++) {
        let cabe = true;
        for (let j = 0; j < parcelasNecessarias; j++) {
          if (saldosSimulados[i + j] < obj.valor_mensal) {
            cabe = false;
            break;
          }
        }

        if (cabe) {
          mesInicio = i;
          break;
        }
      }

      if (mesInicio !== -1) {
        // Encontrou um lugar! 
        // 1. Atualiza os saldos simulados (deduz o valor)
        for (let k = 0; k < parcelasNecessarias; k++) {
          saldosSimulados[mesInicio + k] -= obj.valor_mensal;
        }

        // 2. Adiciona à timeline
        // Convertendo para objeto compatível com LinhaTemporal
        // Datas precisam ser objetos Date reais para o cálculo de grid
        const currentYear = this.systemService.ano.valor;
        const dataInicio = new Date(currentYear, mesInicio, 1);
        const dataFim = new Date(currentYear, mesInicio + parcelasNecessarias - 1, 1);

        console.log(`Adding Objective to Timeline: ${obj.nome} at ${mesInicio}`);

        // Push as immutable array update
        this.despesas = [...this.despesas, {
          descricao: `🎯 ${obj.nome}`, // Ícone para distinguir visualmente
          data_inicio: dataInicio,
          data_fim: dataFim,
          total_parcelas: parcelasNecessarias
        }];
      } else {
        console.log(`Could not find budget for objective: ${obj.nome}`);
      }
    });
  }

  // Mantido igual
  calculaInicioFim(datainicio: Date | string, datafim: Date | string): string {
    const dInicio = new Date(datainicio);
    const dFim = new Date(datafim);

    // +1 porque grid column é 1-based (Janeiro = 1)
    let inicio = dInicio.getUTCMonth() + 1;
    let fim = 0;

    // Se começar antes deste ano, começa no 1
    const anoAtual = this.systemService.ano.valor;
    if (dInicio.getUTCFullYear() < anoAtual) {
      inicio = 1;
    } else if (dInicio.getUTCFullYear() > anoAtual) {
      // Começa depois deste ano? Não deveria aparecer, mas safe guard
      return '0 / 0';
    }

    // Se terminar depois deste ano, vai até o fim (13)
    if (dFim.getUTCFullYear() > anoAtual) {
      fim = 13;
    } else {
      // +2 compensa: 1-based index + abrangência inclusiva do final
      fim = dFim.getUTCMonth() + 2;
    }

    return `${inicio} / ${fim}`;
  }
}
