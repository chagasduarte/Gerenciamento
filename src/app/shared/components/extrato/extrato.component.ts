import { Component, Input, OnInit } from '@angular/core';
import { TransacaoModel } from '../../models/despesa.model';
import { TransacoesService } from '../../services/transacoes.service';
import { CommonModule } from '@angular/common';
import { SystemService } from '../../services/system.service';
import { combineLatest, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { ModalNovaTransacaoComponent } from "../modal-nova-transacao/modal-nova-transacao.component";
import { ToastrService } from 'ngx-toastr';
import { SubcategoriaService } from '../../services/subcategoria.service';
import { Subcategoria } from '../../models/subcategoria.model';

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
  subcategorias!: Subcategoria[]
  constructor(
    private readonly transacoesService: TransacoesService,
    private readonly systemService: SystemService, 
    private readonly router: Router,
    private readonly toast: ToastrService, 
    private readonly subcategoriaService: SubcategoriaService
  ){}

  ngOnInit(): void {
    combineLatest([
      this.systemService.ano$,
      this.systemService.mes$
    ]).subscribe(([ano, mes]) => {
      forkJoin([
        this.transacoesService.Extrato(this.limit, mes.valor + 1, ano.valor),
        this.subcategoriaService.listarAll()
      ]).subscribe({
        next: (success) => {
          this.transacoes = success[0];
          this.subcategorias = success[1];
        },
        error: (err: any) => {
          
        }
      });
    });
  }

  trackByIndex(index: number) {
    return index;
  }

  defineImagem(tipoDespesa: number): string {
    return this.subcategorias.find(x => x.id == tipoDespesa)?.icone!;
  }
  toEstrato() {
    this.router.navigate(['extrato']);
  }
  apagar(id: number) {
    this.transacoesService.DeleteTransacao(id).subscribe({
      next: () => {
        this.toast.success("Deletado");
        this.ngOnInit();
        this.systemService.atualizarResumo();
      }
    })
  }

  efetivar(item: TransacaoModel) {
    item.status = 'pago'
    this.transacoesService.PutEntrada(item.id).subscribe({
      next: (success) => {
        this.toast.success("Tudo Ok");
        this.systemService.atualizarResumo();
      }
    });
  }
  
  restituir(item: TransacaoModel) {
    item.status = 'pendente'
  }

  parcelas(descricao: string) {
    this.router.navigate(["parcelas"], { queryParams: {descricao: descricao}})
  }

}
