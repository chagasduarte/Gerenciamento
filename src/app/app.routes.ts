import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DespesasComponent } from './pages/despesas/despesas.component';
import { EntradasComponent } from './pages/entradas/entradas.component';
import { ContasComponent } from './pages/contas/contas.component';
import { ParcelasComponent } from './pages/parcelas/parcelas.component';
import { GastosComponent } from './pages/gastos/gastos.component';
import { ContasDetalheComponent } from './pages/contas-detalhe/contas-detalhe.component';
import { EntradaDetalhesComponent } from './pages/entrada-detalhes/entrada-detalhes.component';
import { PrevistosComponent } from './pages/previstos/previstos.component';
import { LoginComponent } from './pages/loggin/loggin.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IndexComponent } from './pages/index/index.component';
import { ObjetivosComponent } from './pages/objetivos/objetivos.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
    { path: "despesas", component: DespesasComponent, canActivate: [AuthGuard] },
    { path: "entradas", component: EntradasComponent, canActivate: [AuthGuard] },
    { path: "contas", component: ContasComponent, canActivate: [AuthGuard] },
    { path: "parcelas", component: ParcelasComponent, canActivate: [AuthGuard] },
    { path: "gastos", component: GastosComponent, canActivate: [AuthGuard] },
    { path: "contas-detalhe", component: ContasDetalheComponent, canActivate: [AuthGuard] },
    { path: "entradas-detalhe", component: EntradaDetalhesComponent, canActivate: [AuthGuard] },
    { path: "previstos", component: PrevistosComponent, canActivate: [AuthGuard] },
    { path: "dash", component: DashboardComponent, canActivate: [AuthGuard]},
    { path: "index", component: IndexComponent, canActivate: [AuthGuard]},
    { path: "objetivos", component: ObjetivosComponent, canActivate: [AuthGuard]}
];
