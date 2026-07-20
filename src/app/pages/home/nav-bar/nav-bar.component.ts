import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../shared/services/system.service';
import { CommonModule } from '@angular/common';
import { Ano, Mes } from '../../../utils/meses';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AnosComponent } from "../../../shared/components/anos/anos.component";

@Component({
  selector: 'app-nav-bar',
  imports: [
    CommonModule,
    AnosComponent
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: [
    './nav-bar.component.css',
    './nav-bar.component.mobile.css'
  ]
})
export class NavBarComponent {
  ano: Ano

  // Novas variáveis
  isDashboard: boolean = false;
  constructor(
    private readonly systemService: SystemService,
    private readonly router: Router
  ) {
    this.ano = this.systemService.ano;
  }

  ngOnInit() {
    // Verifica a rota no carregamento inicial
    this.checkIfDashboard(this.router.url);

    // Fica escutando a navegação do usuário
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkIfDashboard(event.urlAfterRedirects);
    });
  }

  // Verifica se está no dashboard
  private checkIfDashboard(url: string) {
    this.isDashboard = url.includes('/dash');
  }


  mudaMes(mes: Mes) {
    this.systemService.setMes(mes);
  }

}
