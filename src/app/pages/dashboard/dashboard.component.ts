import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SystemService } from "../../shared/services/system.service";
import { EvolucaoComponent } from "../../shared/components/charts/evolucao/evolucao.component";
import { CardsComponent } from "../../shared/components/cards/cards.component";
import { CategoriasComponent } from "../../shared/components/charts/categorias/categorias.component";
import { ExtratoComponent } from "../../shared/components/extrato/extrato.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        EvolucaoComponent,
        CardsComponent,
        CategoriasComponent,
        ExtratoComponent
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    resumoMensal$ = this.systemService.resumo$;

    constructor(
        public readonly systemService: SystemService
    ) { }
}