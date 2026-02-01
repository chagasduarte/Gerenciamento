import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DespesasComponent } from './pages/home/despesas/despesas.component';
import { EntradasComponent } from './pages/home/entradas/entradas.component';
import { ParcelasComponent } from './pages/home/parcelas/parcelas.component';
import { GastosComponent } from './pages/home/gastos/gastos.component';
import { EntradaDetalhesComponent } from './pages/home/entrada-detalhes/entrada-detalhes.component';
import { LoginComponent } from './pages/loggin/loggin.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IndexComponent } from './pages/home/index/index.component';
import { ObjetivosComponent } from './pages/home/objetivos/objetivos.component';
import { PagamentosComponent } from './pages/home/pagamentos/pagamentos.component';
import { DadosComponent } from './pages/home/dados/dados.component';
import { InvestimentosComponent } from './pages/home/investimentos/investimentos.component';
import { RegisterComponent } from './pages/register/register.component';
import { ConfigComponent } from './pages/config/config.component';
import { ExtratoComponent } from './shared/components/extrato/extrato.component';
import { PlanosComponent } from './pages/home/planos/planos.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'config', component: ConfigComponent, canActivate: [AuthGuard] },
  {
    path: "", component: HomeComponent,
    children: [
      { path: "", redirectTo: "home", pathMatch: "full" },
      { path: "home", component: DadosComponent, canActivate: [AuthGuard] },
      { path: "despesas", component: DespesasComponent, canActivate: [AuthGuard] },
      { path: "entradas", component: EntradasComponent, canActivate: [AuthGuard] },
      { path: "parcelas", component: ParcelasComponent, canActivate: [AuthGuard] },
      { path: "gastos", component: GastosComponent, canActivate: [AuthGuard] },
      { path: "entradas-detalhe", component: EntradaDetalhesComponent, canActivate: [AuthGuard] },
      { path: "dash", component: DashboardComponent, canActivate: [AuthGuard] },
      { path: "index", component: IndexComponent, canActivate: [AuthGuard] },
      { path: "objetivos", component: ObjetivosComponent, canActivate: [AuthGuard] },
      { path: "pagamentos", component: PagamentosComponent, canActivate: [AuthGuard] },
      { path: "investimentos", component: InvestimentosComponent, canActivate: [AuthGuard] },
      { path: "extrato", component: ExtratoComponent, canActivate: [AuthGuard] },
      { path: "cartoes", loadComponent: () => import('./pages/home/cartao/cartao.component').then(m => m.CartaoComponent), canActivate: [AuthGuard] },
      { path: "objetivos", component: ObjetivosComponent, canActivate: [AuthGuard] },
      { path: "planos", component: PlanosComponent, canActivate: [AuthGuard] }
    ],
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' }
];
