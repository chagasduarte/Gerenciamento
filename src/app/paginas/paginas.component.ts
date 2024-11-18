import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Ano, Mes } from '../utils/meses';
import { SystemService } from '../shared/services/system.service';
import { HomeComponent } from '../pages/home/home.component';

@Component({
  selector: 'app-paginas',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './paginas.component.html',
  styleUrl: './paginas.component.css'
})
export class PaginasComponent implements AfterViewInit{
  @ViewChild('infos', { read: ViewContainerRef }) infos!: ViewContainerRef;

  ano!: Ano;
  paginaAtual: string = 'home';

  constructor(private readonly systemService: SystemService)
  {
    this.ano = new Ano(this.systemService.ano.valor);
  }
  ngAfterViewInit(): void {
    this.infos.createComponent(HomeComponent);
  }

  mudaMes(mes: Mes) {
    this.systemService.mes = mes;
  }

  mudaPagina(){
    this.infos.clear();
    switch(this.paginaAtual){
      case 'home':
        this.infos.createComponent(HomeComponent);
    }
  }

}
