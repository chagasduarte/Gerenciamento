import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SystemService } from "../../shared/services/system.service";
import { TipoDespesaGrafico } from "../../shared/models/graficos";
import { Router } from "@angular/router";
import { Ano } from "../../utils/meses";
import { combineLatest, forkJoin } from "rxjs";
import { Projecao } from "../../shared/models/projecao.model";
import { TransacoesService } from "../../shared/services/transacoes.service";
import { EvolucaoComponent } from "../../shared/components/charts/evolucao/evolucao.component";

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
    
}