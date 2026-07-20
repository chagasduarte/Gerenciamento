import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemService } from '../../../services/system.service';
import { TransacoesService } from '../../../services/transacoes.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface TimelineItem {
  descricao: string;
  total_parcelas: number;
  mesesAtivos: {
    mes: number;
    parcelas: { pago: boolean; valor: number }[]; // Guardamos o valor e o status de cada parcela
  }[];
  primeiroMes: number;
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
        if (!res || res.length == 0) {
          this.items = [];
          this.loading = false;
          return;
        }

        const requests = res.map(item =>
          this.transacoesService.GetParcelas(item.descricao).pipe(
            catchError(() => of({ despesa: [], soma: 0 }))
          )
        );

        forkJoin(requests).subscribe({
          next: (parcelasRes) => {
            this.items = res.map((item, index) => {
              const parcelasDaDivida = parcelasRes[index].despesa || [];

              // O Map agora guarda o array de 'parcelas' (com valor e pago)
              const mesesAgrupadosMap = new Map<number, { mes: number, parcelas: { pago: boolean, valor: number }[] }>();

              parcelasDaDivida.forEach(p => {
                const dataStr = p.data ? p.data.toString() : '';
                if (!dataStr) return;

                const d = new Date(dataStr.includes('T') ? dataStr : `${dataStr}T00:00:00`);
                if (d.getFullYear() !== ano) return;

                const mes = d.getMonth() + 1;
                const isPago = p.status ? p.status.toLowerCase() == 'pago' : false;
                const valorParcela = Number(p.valor); // Garante que é número

                if (mesesAgrupadosMap.has(mes)) {
                  const mesExistente = mesesAgrupadosMap.get(mes)!;
                  // Adicionamos o objeto da nova parcela na lista deste mês
                  mesExistente.parcelas.push({ pago: isPago, valor: valorParcela });
                } else {
                  // Criamos o mês já com a primeira parcela dentro do array
                  mesesAgrupadosMap.set(mes, {
                    mes: mes,
                    parcelas: [{ pago: isPago, valor: valorParcela }]
                  });
                }
              });

              const mesesAtivos = Array.from(mesesAgrupadosMap.values()).sort((a, b) => a.mes - b.mes);

              return {
                descricao: item.descricao,
                total_parcelas: item.total_parcelas,
                mesesAtivos: mesesAtivos,
                primeiroMes: mesesAtivos.length > 0 ? mesesAtivos[0].mes : 99
              };
            })
              .filter(x => x.mesesAtivos.length > 0)
              .sort((a, b) => a.primeiroMes - b.primeiroMes || b.mesesAtivos.length - a.mesesAtivos.length);
            console.log(this.items)
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  isMesAtivo(item: TimelineItem, mes: number): boolean {
    return item.mesesAtivos.some(m => m.mes == mes);
  }
  isMesPago(item: TimelineItem, mes: number): boolean {
    const mesObj = item.mesesAtivos.find(m => m.mes == mes);

    // Se o mês existir e tiver parcelas, verifica se TODAS as parcelas estão com pago: true
    if (mesObj && mesObj.parcelas.length > 0) {
      return mesObj.parcelas.every(parcela => parcela.pago == true);
    }

    return false;
  }

  getParcelasDoMes(item: TimelineItem, mesProcurado: number): { pago: boolean, valor: number }[] {
    const mesEncontrado = item.mesesAtivos.find(m => m.mes == mesProcurado);
    return mesEncontrado ? mesEncontrado.parcelas : [];
  }
}
