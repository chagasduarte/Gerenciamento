import { Component, Input } from '@angular/core';
import { Mes } from '../../../utils/meses';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SystemService } from '../../services/system.service';

@Component({
  selector: 'app-mensal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './mensal.component.html',
  styleUrl: './mensal.component.css'
})
export class MensalComponent {
   constructor(public systemService: SystemService){}
}
