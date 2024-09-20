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
import { AnualComponent } from './shared/components/anual/anual.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: "home", component: HomeComponent },
    { path: "despesas", component: DespesasComponent, canActivate: [AuthGuard] },
    { path: "entradas", component: EntradasComponent, canActivate: [AuthGuard] },
    { path: "contas", component: ContasComponent, canActivate: [AuthGuard] },
    { path: "parcelas", component: ParcelasComponent, canActivate: [AuthGuard] },
    { path: "gastos", component: GastosComponent},
    { path: "contas-detalhe", component: ContasDetalheComponent, canActivate: [AuthGuard] },
    { path: "entradas-detalhe", component: EntradaDetalhesComponent, canActivate: [AuthGuard] },
    { path: "previstos", component: PrevistosComponent, canActivate: [AuthGuard] },
    { path: "anual", component: AnualComponent}
];
