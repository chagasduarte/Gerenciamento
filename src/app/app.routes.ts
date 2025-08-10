import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DespesasComponent } from './pages/home/despesas/despesas.component';
import { EntradasComponent } from './pages/home/entradas/entradas.component';
import { ContasComponent } from './pages/home/contas/contas.component';
import { ParcelasComponent } from './pages/home/parcelas/parcelas.component';
import { GastosComponent } from './pages/home/gastos/gastos.component';
import { ContasDetalheComponent } from './pages/home/contas-detalhe/contas-detalhe.component';
import { EntradaDetalhesComponent } from './pages/home/entrada-detalhes/entrada-detalhes.component';
import { PrevistosComponent } from './pages/home/previstos/previstos.component';
import { LoginComponent } from './pages/loggin/loggin.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IndexComponent } from './pages/home/index/index.component';
import { ObjetivosComponent } from './pages/home/objetivos/objetivos.component';
import { Pagamento } from './shared/models/pagamentos';
import { PagamentosComponent } from './pages/home/pagamentos/pagamentos.component';
import { DadosComponent } from './pages/home/dados/dados.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: "", component: HomeComponent, 
      children: [
        { path: "", component: DadosComponent, canActivate: [AuthGuard] },
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
        { path: "objetivos", component: ObjetivosComponent, canActivate: [AuthGuard]},
        { path: "pagamentos", component: PagamentosComponent, canActivate: [AuthGuard]}
      ],
      canActivate: [AuthGuard]
    }
];
