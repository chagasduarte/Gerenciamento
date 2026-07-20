import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemService } from '../../../services/system.service';
import { TransacoesService } from '../../../services/transacoes.service';

export interface TimelineItem {
  descricao: string;
  total_parcelas: number;
  data_inicio: string;
  data_fim: string;
  startCol: number;
  span: number;
}

@Component({
  selector: 'app-linha-temporal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './linha-temporal.component.html',
  styleUrls: ['./linha-temporal.component.css']
})
export class LinhaTemporalComponent implements OnInit {
  meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  items: TimelineItem[] = [];
  loading = true;

  constructor(
    private readonly systemService: SystemService,
    private readonly transacoesService: TransacoesService
  ) { }

  ngOnInit(): void {
    this.systemService.ano$.subscribe(ano => {
      this.carregarDados(ano.valor);
    });
  }

  carregarDados(ano: number): void {
    this.loading = true;
    this.transacoesService.GetLinhaTemporal(ano).subscribe({
      next: (res) => {
        this.items = res.map(item => {
          // Parse string to Date keeping timezone simple (we only care about year/month)
          // Adding "T00:00:00" ensures it parses as local time correctly if it's YYYY-MM-DD
          const dStr = item.data_inicio.toString().includes('T') ? item.data_inicio.toString() : `${item.data_inicio}T00:00:00`;
          const dFimStr = item.data_fim.toString().includes('T') ? item.data_fim.toString() : `${item.data_fim}T00:00:00`;

          const dInicio = new Date(dStr);
          const dFim = new Date(dFimStr);

          let startCol = 2;
          if (dInicio.getFullYear() === ano) {
            startCol = dInicio.getMonth() + 2;
          } else if (dInicio.getFullYear() > ano) {
            startCol = 14;
          }

          let endCol = 13;
          if (dFim.getFullYear() === ano) {
            endCol = dFim.getMonth() + 2;
          } else if (dFim.getFullYear() < ano) {
            endCol = 1;
          }

          return {
            descricao: item.descricao,
            total_parcelas: item.total_parcelas,
            data_inicio: item.data_inicio.toString(),
            data_fim: item.data_fim.toString(),
            startCol: startCol,
            span: Math.max(1, endCol - startCol + 1),
            isActive: startCol <= 13 && endCol >= 2
          };
        })
          .filter((x: any) => x.isActive)
          .sort((a, b) => a.startCol - b.startCol || b.span - a.span); // Sort by earliest start, then longest span

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
