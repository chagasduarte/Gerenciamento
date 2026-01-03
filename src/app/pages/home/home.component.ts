import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SystemService } from '../../shared/services/system.service';
import { Ano, Mes } from '../../utils/meses';
import { ResumoMensal } from '../../shared/models/resumo.model';
import { ToastrService } from 'ngx-toastr';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { AuthService } from '../../shared/services/auth.service';
import { Usuario } from '../../shared/models/user.model';
import { UsuarioService } from '../../shared/services/usuario.service';
import { SideBarComponent } from "./side-bar/side-bar.component";
import { CardsComponent } from "../../shared/components/cards/cards.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    NavBarComponent,
    SideBarComponent,
    CardsComponent
],
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css',
    './home.component.mobile.css',
    './home.component.extras.css'
  ]
})
export class HomeComponent implements OnInit {

  ano!: Ano;
  colorMensal = '#fff';
  colorAnual = '#768da1';
  resumoMensal$ = this.systemService.resumo$; // <-- agora é reativo
  anosDeDivida: number[] = [2024, 2025, 2026, 2027, 2028];
  usuario!: Usuario | null;
  avatarUrl: string = "";
  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly router: Router,
    private readonly toastService: ToastrService,
    public readonly systemService: SystemService,
    private readonly authService: AuthService,
    private readonly userService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.ano = this.systemService.ano;
    this.authService.usuario$.subscribe(user => this.usuario = user);
    this.userService.getAvatar(this.usuario!.id).subscribe({
      next: (success) => {this.avatarUrl = success.avatarUrl;}
    })
  }

  mudaMes(mes: Mes) {
    this.systemService.setMes(mes);
  }

  mudaAno(ano: number) {
    if (ano < 2024) return;

    const mesAtual = 
      ano === new Date().getUTCFullYear() ? new Date().getUTCMonth() : 0;

    this.systemService.setAno(new Ano(ano));
    this.systemService.setMes(new Mes(mesAtual, ano));
    this.ano = new Ano(ano);
  }
  logout(){
    this.authService.logout();
    this.router.navigate(["login"])
  }
  // Navegação
  adicionarDespesa() { this.router.navigate(['despesas']); }
  parcelas() { this.router.navigate(['parcelas']); }
  gastos() { this.router.navigate(['gastos']); }
  contasDetalhes() { this.router.navigate(['contas-detalhe']); }
  entradaDetalhes() { this.router.navigate(['entradas-detalhe']); }
  previstos() { this.router.navigate(['previstos']); }
  dashboard() { this.router.navigate(['dash']); }
}
