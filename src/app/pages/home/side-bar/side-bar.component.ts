import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../shared/services/system.service';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../shared/services/usuario.service';
import { Usuario } from '../../../shared/models/user.model';
import { AnosComponent } from "../../../shared/components/anos/anos.component";
import { ResumoComponent } from "../../../shared/components/charts/resumo/resumo.component";

@Component({
  selector: 'app-side-bar',
  imports: [
    CommonModule,
    AnosComponent,
    ResumoComponent
],
  templateUrl: './side-bar.component.html',
  styleUrls: [
    './side-bar.component.css',
    './side-bar.component.mobile.css'
  ]
})
export class SideBarComponent implements OnInit{
  resumoMensal$ = this.systemService.resumo$; // <-- agora é reativo
  avatarUrl: string = "";
  usuario!: Usuario | null;

  constructor(    
    public readonly systemService: SystemService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly userService: UsuarioService
  ){}
  ngOnInit(): void {
    this.authService.usuario$.subscribe(user => this.usuario = user);
    this.userService.getAvatar(this.usuario!.id).subscribe({
      next: (success) => {this.avatarUrl = success.avatarUrl;}
    })
  }
  collapsed = false;

  toggle() {
    this.collapsed = !this.collapsed;
  }
  logout(){
    this.authService.logout();
    this.router.navigate(["login"])
  }
}
