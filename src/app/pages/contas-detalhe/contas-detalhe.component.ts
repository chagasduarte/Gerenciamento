import { Component } from '@angular/core';
import { Conta } from '../../shared/models/conta';
import { ContasService } from '../../shared/services/contas.service';
import { CommonModule } from '@angular/common';
import { GastosComponent } from '../gastos/gastos.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
    private readonly route: Router          
  ) {}

  ngOnInit(): void {
    this.buscaContas();
  }
 
  buscaContas(){
    this.contaService.GetContas().subscribe(contas => this.contas = contas);
  }

  updateDebito(conta: Conta): void {
    this.contaService.PutConta(conta).subscribe(
      x => this.buscaContas() 
    );
  }

  voltar(){
    this.route.navigate([""]);
  }
  AdicionaConta() {
    this.route.navigate(["contas"]);
  }
}
