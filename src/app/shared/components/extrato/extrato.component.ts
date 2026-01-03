import { Component, Input, OnInit } from '@angular/core';
import { TransacaoModel } from '../../models/despesa.model';
import { TransacoesService } from '../../services/transacoes.service';
import { CommonModule } from '@angular/common';
import { SystemService } from '../../services/system.service';
import { combineLatest, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { ModalNovaTransacaoComponent } from "../modal-nova-transacao/modal-nova-transacao.component";

@Component({
  selector: 'app-extrato',
  imports: [
    CommonModule,
    ModalNovaTransacaoComponent
],
  templateUrl: './extrato.component.html',
  styleUrls: [
    './extrato.component.css',
    './extrato.component.mobile.css',
  ]
})
export class ExtratoComponent implements OnInit{
  transacoes!: TransacaoModel[];
  @Input() limit: number = 0;
  @Input() pagina: boolean = false;

  constructor(
    private readonly transacoesService: TransacoesService,
    private readonly systemService: SystemService, 
    private readonly router: Router
  ){}

  ngOnInit(): void {
    combineLatest([
      this.systemService.ano$,
      this.systemService.mes$
    ]).subscribe(([ano, mes]) => {
      forkJoin([
        this.transacoesService.Extrato(this.limit, mes.valor + 1, ano.valor)
      ]).subscribe({
        next: (success) => {
          this.transacoes = success[0];
        },
        error: (err: any) => {
          
        }
      });
    });
  }

  trackByIndex(index: number) {
    return index;
  }

  private imagens: Record<number, string> = {
    1: 'assets/img/food-wine-cheese-bread-national-culture-paris.svg',
    2: 'assets/img/sport-utility-vehicle.svg',
    3: 'assets/img/health.svg',
    4: 'assets/img/books.svg',
    5: 'assets/img/beach.svg',
    6: 'assets/img/house-with-garden.svg',
    7: 'assets/img/customer-service.svg',
    8: 'assets/img/tools-chainsaw.svg',
    9: 'assets/img/revenue.svg'
  };

  defineImagem(tipoDespesa: number): string {
    return this.imagens[tipoDespesa] ?? 'assets/img/money-bag.svg';
  }
  toEstrato() {
    this.router.navigate(['extrato']);
  }
}
