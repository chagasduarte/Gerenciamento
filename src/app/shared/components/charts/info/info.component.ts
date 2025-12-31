import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SystemService } from '../../../services/system.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info',
  imports: [
    CommonModule
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  resumoMensal$ = this.systemService.resumo$; // <-- agora é reativo
  constructor(    
      public readonly systemService: SystemService,
      private readonly router: Router
  ){}
  dashboard() { this.router.navigate(['dash']); }

}
