import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { SystemService } from './shared/services/system.service';
import { AuthService } from './shared/services/auth.service';
import { HomeComponent } from "./pages/home/home.component";
import { SideBarComponent } from './shared/components/side-bar/side-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HomeComponent,
    SideBarComponent,
    RouterOutlet,
    CommonModule,
    NgxSpinnerComponent,
    HomeComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
   
  constructor(public authService: AuthService){}

}
