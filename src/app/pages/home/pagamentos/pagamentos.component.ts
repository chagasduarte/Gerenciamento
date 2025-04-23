import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../../shared/services/system.service';

@Component({
  selector: 'app-pagamentos',
  imports: [],
  templateUrl: './pagamentos.component.html',
  styleUrl: './pagamentos.component.css'
})
export class PagamentosComponent implements OnInit {
  constructor(
    private systemService: SystemService
  ) {}
    
  ngOnInit(): void {
    
  }

}
