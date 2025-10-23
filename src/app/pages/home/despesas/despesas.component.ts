import { Component } from '@angular/core';
import { Despesa } from '../../../shared/models/despesa';
import { DespesasService } from '../../../shared/services/despesas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ParcelasService } from '../../../shared/services/parcelas.service';
import { ParcelaRequest } from '../../../shared/models/parcela';
import { ContasService } from '../../../shared/services/contas.service';
import { Conta } from '../../../shared/models/conta';
import { FormataDespesa } from '../../../utils/functions/despesa';
import { DespesaModel } from '../../../shared/models/despesa.model';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-despesas',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './despesas.component.html',
    styleUrl: './despesas.component.css'
})
export class DespesasComponent {
  contas: Conta[] = []
  despesa: Despesa;
  requestParcela: ParcelaRequest; 

  dataCompra: Date = new Date();
  novaDespesa!: DespesaModel;

  constructor(
    private readonly despesaService: DespesasService,
    private readonly parcelaService: ParcelasService,
    private readonly route: Router,
    private readonly toastService: ToastrService             
  ){
    this.despesa = {} as Despesa;
    this.novaDespesa = {} as DespesaModel;
    this.requestParcela = {} as ParcelaRequest;
  }
  OnSubmit() {
    this.novaDespesa.data = new Date(this.dataCompra);
    this.novaDespesa.categoria = parseInt(this.novaDespesa.categoria.toString());
    this.novaDespesa.tipo = 'saida';
    this.novaDespesa.status = 'pendente';
    this.despesaService.PostDespesa(this.novaDespesa).subscribe({
      next: (success: DespesaModel) => {
          this.toastService.success("Gravado");
          this.route.navigate(["home"]);
      },
      error: (err: any) => {
        this.toastService.error(err.message);
        this.route.navigate(["home"]);
      }
    })
  }
}
