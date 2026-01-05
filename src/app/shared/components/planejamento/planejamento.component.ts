import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit} from '@angular/core';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';
import { PlanejamentoAgrupadoTipo } from '../../models/planejamentoagrupado';
import { PlanejamentoCompComponent } from "../charts/planejamento-comp/planejamento-comp.component";
import { ModalNovoPlanejamentoComponent } from "../modal-novo-planejamento/modal-novo-planejamento.component";
import { PlanejamentoService } from '../../services/planejamento.service';
import { SystemService } from '../../services/system.service';
import { ResumoMensal } from '../../models/resumo.model';
import { TransacoesService } from '../../services/transacoes.service';
import { AgrupamentoResponse } from '../../models/agrupamento';
import { combineLatest, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Planejamento } from '../../models/planejamento';
import { agruparPorCategoria } from '../../../utils/functions/agruparPorCategoria';

interface AgrupadoPorCategoriaMap {
  [categoria: number]: {
    categoria: number;
    total_tipo: number;
  };
}


@Component({
  selector: 'app-planejamento',
  imports: [
    CommonModule,
    PlanejamentoCompComponent,
    ModalNovoPlanejamentoComponent
],
  templateUrl: './planejamento.component.html',
  styleUrls: [
    './planejamento.component.css',
    './planejamento.component.mobile.css',
  ]
})
export class PlanejamentoComponent implements OnInit{

  tipo: string = "Saídas";
  planejados: number = 0;
  valor: number = 0;
  percent: number = 0;
  abaAtiva: 'entradas' | 'saidas' = 'saidas';
  planejamentos: PlanejamentoAgrupadoTipo[] = [];
  resumoMensal$ = this.systemService.resumo$; // <-- agora é reativo
  resumoMensal!: ResumoMensal;
  agrupamentoSaidas!: AgrupamentoResponse;
  agrupamentoEntradas!: AgrupamentoResponse;
  agrupamentoCategoria: any;

  constructor(
    private readonly planejamentoService: PlanejamentoService,
    private readonly systemService: SystemService,
    private readonly transacoesService: TransacoesService,
    private readonly toast: ToastrService
  ){}

  ngOnInit(): void {
    this.requisicoesApi()
  }
  requisicoesApi(){
    combineLatest([
        this.systemService.ano$,
        this.systemService.mes$
    ]).subscribe(([ano, mes]) => {
        forkJoin([
            this.planejamentoService.listar(),
            this.transacoesService.GetAgrupamento(mes.valor + 1, ano.valor, 'saida'),
            this.transacoesService.GetAgrupamento(mes.valor + 1, ano.valor, 'entrada'),
        ]).subscribe({
          next: (success) => {
            this.planejamentos = success[0];
            this.planejados = this.planejamentos.find(x => x.tipo == this.abaAtiva)?.soma!;
            this.agrupamentoSaidas = success[1];
            this.agrupamentoEntradas = success[2];
            this.valor = this.agrupamentoSaidas.soma.soma??0;
            this.agrupamentoCategoria = agruparPorCategoria(this.agrupamentoSaidas);
          },
          error: (err) => {
            console.error(err);
            this.toast.error(err.message);
          } 
        })
    });
  }


  selecionar(tab: 'entradas' | 'saidas') {
    this.abaAtiva = tab;
    this.tipo = tab == 'entradas'? 'Entradas' : 'Saídas';
    this.planejados = this.planejamentos.find(x => x.tipo == tab)?.soma!;
    this.valor = this.abaAtiva == 'entradas'?  this.agrupamentoEntradas?.soma.soma??0 : this.agrupamentoSaidas?.soma.soma??0 
  }
}
