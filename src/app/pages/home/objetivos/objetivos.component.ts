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
export class ObjetivosComponent implements OnInit{
  filtroSelecionado = 'todos';
  despesas: LinhaTemporal[] = [];
  ano$ = this.systemService.ano$;
  objetivos: Objetivo[] = [];
  
  get objetivosFiltrados() {
    if (this.filtroSelecionado === 'todos') return this.objetivos;
    return this.objetivos.filter(o => o.status === this.filtroSelecionado);
  }

  constructor(
    private readonly objetivosService: ObjetivosService,
    private readonly toastrService: ToastrService,
    private readonly systemService: SystemService,
    private readonly transacao: TransacoesService
  ){}

  ngOnInit(): void {
    this.objetivosService.listar().subscribe({
      next: (success) => {
        this.objetivos = success;
        console.log(this.objetivos);
      }
    });
    this.buscaLinhadoTempo();
    this.ano$.subscribe(ano => {
      this.buscaLinhadoTempo();
    })
  }
  mudarFiltro(filtro: string) {
    this.filtroSelecionado = filtro;
  }

  buscaLinhadoTempo(){
    this.transacao.GetLinhaTemporal(this.systemService.ano.valor).subscribe({
      next: (success) => {
        this.despesas = success;
      },
      error: (err:any) => {
        this.toastrService.error("não foi possível buscar as despesas", "Erro")
      }
    })
  }
  calcularDataFinal(dataInicio: string, parcelas: number): Date {
    const data = new Date(dataInicio);
    data.setMonth(data.getMonth() + parcelas - 1);
    return data;
  }
  
  calculaInicioFim(datainicio: Date = new Date(), datafim:Date = new Date()): string {
    datainicio = new Date(datainicio);
    datafim = new Date(datafim);
    
    let inicio = datainicio.getUTCMonth() + 1;
    let fim = 0;
    if(datainicio.getUTCFullYear()  < datafim.getUTCFullYear()) {
      fim = 13;
    }
    else {
      fim = datafim.getUTCMonth() + 2;
    }
    return `${inicio} / ${fim}`;
  }
}
