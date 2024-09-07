import { Component } from '@angular/core';
import { Conta } from '../../shared/models/conta';
import { ContasService } from '../../shared/services/contas.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private contaService: ContasService,
    private readonly route: Router,
    private readonly toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.buscaContas();
  }
 
  buscaContas(){
    // this.contaService.GetContaByMes(new Date().getUTCMonth() + 1).subscribe(contas => this.contas = contas);
    this.contaService.GetContas().subscribe(contas => this.contas = contas);

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
    return new Date(conta.ano, conta.mes-1, 1);
  }
    
}
