import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  constructor(private readonly router: Router){}
  Home(){
    this.router.navigate(["home"]);
  }
  DashBoard(){
    this.router.navigate(["dash"]);
  }
  Previstos(){
    this.router.navigate(["previstos"]);
  }
}
