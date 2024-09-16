import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { EntradasService } from '../../shared/services/entradas.service';
import { Entrada } from '../../shared/models/entradas';
import { FormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import { GetSalarioLiquido } from '../../utils/functions/salario';
import { Router } from '@angular/router';
import { ContasService } from '../../shared/services/contas.service';
import { ToastrService } from 'ngx-toastr';
import { SystemService } from '../../shared/services/system.service';
import { Ano, Mes } from '../../utils/meses';

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
  ano: Ano
  constructor(
    private readonly entradaService: EntradasService,
    private readonly contaService: ContasService,
    private readonly router: Router,
    private readonly toastrService: ToastrService,
    private systemsService: SystemService
  ){
    this.ano = new Ano();
  }
  ngOnInit(): void {
    this.buscaEntradas();
  }
  mudaMes(mes: Mes){
    this.systemsService.mes = mes;
    this.entradasFuturas = [];
    this.entradasRecebidas = [];
    this.buscaEntradas();
  }
  buscaEntradas() {
    this.entradaService.GetEntradas().subscribe( x => {
      x.map(entrada => {
        entrada.dataDebito = new Date(entrada.dataDebito);
        if (entrada.dataDebito.getUTCMonth() == this.systemsService.mes.valor && entrada.dataDebito.getUTCFullYear() == this.systemsService.ano.valor){
          if (entrada.status) {
            this.entradasRecebidas.push(entrada);
          }
          else {
            this.entradasFuturas.push(entrada);
          }
        }
      });
    });
  }

  receber(entrada: Entrada, valor: number) {
    this.contaService.GetContaById(entrada.contaId).subscribe(x => {
      if(entrada.isFixo){
        x.debito += valor;
      }
      else {
        x.debito += entrada.valor;
      }
      this.contaService.PutConta(x).subscribe(x => {
        entrada.status = true;
        this.entradaService.PutEntrada(entrada).subscribe(x => {
          this.toastrService.success("Ok", "O valor solicitado já está em sua conta");
        });
      })
    })
    
  }

  atualizaSalario(entrada: Entrada) {
    this.entradaService.PutEntrada(entrada).subscribe(x => {
      this.toastrService.success("Ok", "O valor do salário foi atualizado com sucesso.");
      this.buscaEntradas();
    });

  }

  deleteEntrada(id: number){
    this.entradaService.DeleteEntrada(id).subscribe(x => {
      this.toastrService.success("Entrada deletada","OK");
      this.buscaEntradas();
    })
  }

  voltar() {
    this.router.navigate(["home"]);
  }
  GetSalarioLiquido(salario: number): any {
    return GetSalarioLiquido(salario);
  }
  AdicionaEntrada() {
    this.router.navigate(["entradas"]);
  }
}
