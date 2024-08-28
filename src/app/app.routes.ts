import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DespesasComponent } from './pages/despesas/despesas.component';
import { EntradasComponent } from './pages/entradas/entradas.component';
import { ContasComponent } from './pages/contas/contas.component';
import { ParcelasComponent } from './pages/parcelas/parcelas.component';

export const routes: Routes = [
    { path:"", component: HomeComponent },
    { path: "despesas", component: DespesasComponent },
    { path: "entradas", component: EntradasComponent },
    { path: "contas", component: ContasComponent },
    { path: "parcelas", component: ParcelasComponent }
];
