import { Component } from '@angular/core';
import { Conta } from '../../shared/models/conta';
import { ContasService } from '../../shared/services/contas.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SystemService } from '../../shared/services/system.service';
import { Ano, Mes } from '../../utils/meses';

@Component({
    selector: 'app-contas-detalhe',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule
    ],
    templateUrl: './contas-detalhe.component.html',
    styleUrl: './contas-detalhe.component.css'
})
export class ContasDetalheComponent {

  contas: Conta[] = [];
  ano: Ano
  constructor(
    private contaService: ContasService,
    private readonly route: Router,
    private readonly toastrService: ToastrService,
    private readonly systemService: SystemService
  ) {
    this.ano = new Ano(this.systemService.ano.valor);
  }

  ngOnInit(): void {
    this.buscaContas();
  }
 
  buscaContas(){
    this.contaService.GetContaByMes(this.systemService.mes.valor + 1, this.systemService.ano.valor).subscribe(contas => this.contas = contas);
    // this.contaService.GetContas().subscribe(contas => this.contas = contas);

  }

  updateDebito(conta: Conta): void {
    this.contaService.PutConta(conta).subscribe( x => {
      this.toastrService.success("Conta Atualizada com sucesso", "OK")
      this.buscaContas() 
    });
  }

  voltar(){
    this.route.navigate(["home"]);
  }
  AdicionaConta() {
    this.route.navigate(["contas"]);
  }
  retornaMes(conta: Conta): Date {
    return new Date(conta.Ano, conta.Mes-1, 1);
  }


  mudaMes(mes: Mes){
    this.systemService.mes = mes;
    this.buscaContas()
  }

  deletarConta(id: number) {
    if (confirm("Deseja realmente deletar essa conta?").valueOf()) {
      this.contaService.DeleteConta(id).subscribe(x => {
        this.buscaContas();
      });
    }
  }
  editar(id: number){
    this.route.navigate(["contas", {id}])
  }
}
