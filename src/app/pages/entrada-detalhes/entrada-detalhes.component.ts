import { Component, OnInit } from '@angular/core';
import { EntradasService } from '../../shared/services/entradas.service';
import { Entrada } from '../../shared/models/entradas';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GetSalarioLiquido } from '../../utils/functions/salario';
import { Router } from '@angular/router';
import { ContasService } from '../../shared/services/contas.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-entrada-detalhes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './entrada-detalhes.component.html',
  styleUrl: './entrada-detalhes.component.css'
})
export class EntradaDetalhesComponent implements OnInit{


  entradasFuturas: Entrada[] = [];
  entradasRecebidas: Entrada[] = [];

  constructor(
    private readonly entradaService: EntradasService,
    private readonly contaService: ContasService,
    private readonly router: Router,
    private readonly toastrService: ToastrService
  ){
  }
  ngOnInit(): void {
    this.entradaService.GetEntradas().subscribe( x => {
      x.map(entrada => {
        entrada.dataDebito = new Date(entrada.dataDebito);
        if (entrada.status) {
          this.entradasRecebidas.push(entrada);
        }
        else {
          this.entradasFuturas.push(entrada);
        }
      })
    });
  }


  receber(entrada: Entrada, valor: number) {
    this.contaService.GetContaById(entrada.contaId).subscribe(x => {
      x.debito += valor;
      this.contaService.PutConta(x).subscribe(x => {
        entrada.status = true;
        this.entradaService.PutEntrada(entrada).subscribe(x => {
          this.toastrService.success("Ok", "O valor solicitado já está em sua conta");
        });
      })
    })
    
  }

  atualizaSalario(entrada: Entrada) {
    this.entradaService.PutEntrada(entrada).subscribe(x => this.toastrService.success("Ok", "O valor do salário foi atualizado com sucesso."))
  }

  voltar() {
    this.router.navigate([""]);
  }
  GetSalarioLiquido(salario: number): any {
    return GetSalarioLiquido(salario);
  }
  AdicionaEntrada() {
    this.router.navigate(["entradas"]);
  }
}
