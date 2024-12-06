import { Component } from '@angular/core';
import { SystemService } from '../../shared/services/system.service';
import { Ano, Mes } from '../../utils/meses';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

  ano!: Ano;
  constructor(private readonly systemService: SystemService){this.ano = new Ano(this.systemService.ano.valor);}

  mudaMes(mes: Mes) {

  }
}
