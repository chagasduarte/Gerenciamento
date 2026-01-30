import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SystemService } from "../../shared/services/system.service";
import { EvolucaoComponent } from "../../shared/components/charts/evolucao/evolucao.component";
import { PlanejamentoComponent } from "../../shared/components/planejamento/planejamento.component";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        EvolucaoComponent
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