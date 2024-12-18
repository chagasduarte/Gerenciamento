import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { SystemService } from './shared/services/system.service';
import { AuthService } from './shared/services/auth.service';
import { HomeComponent } from "./pages/home/home.component";
import { SideBarComponent } from './shared/components/side-bar/side-bar.component';
import { LoginComponent } from "./pages/loggin/loggin.component";

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        CommonModule,
        NgxSpinnerComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild('paginas', { read: ViewContainerRef } ) paginas!: ViewContainerRef
  anosDeDivida: number[] = [2024, 2025, 2026];

  constructor(public authService: AuthService){}

  mudaAno(ano: number){
    this.paginas.element.nativeElement.innerHTML = '';
    this.paginas.clear();
    this.paginas.createComponent(HomeComponent);    
  }
  
}
