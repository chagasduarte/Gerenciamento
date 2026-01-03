import { CommonModule } from '@angular/common';
import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { AuthService } from './shared/services/auth.service';
import { HomeComponent } from "./pages/home/home.component";

@Component({
    selector: 'app-root',
    standalone: true,
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
