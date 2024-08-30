import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DespesasComponent } from './pages/despesas/despesas.component';
import { EntradasComponent } from './pages/entradas/entradas.component';
import { ContasComponent } from './pages/contas/contas.component';
import { ParcelasComponent } from './pages/parcelas/parcelas.component';
import { GastosComponent } from './pages/gastos/gastos.component';
import { ContasDetalheComponent } from './pages/contas-detalhe/contas-detalhe.component';
import { EntradaDetalhesComponent } from './pages/entrada-detalhes/entrada-detalhes.component';

export const routes: Routes = [
    { path:"", component: HomeComponent },
    { path: "despesas", component: DespesasComponent },
    { path: "entradas", component: EntradasComponent },
    { path: "contas", component: ContasComponent },
    { path: "parcelas", component: ParcelasComponent },
    { path: "gastos", component: GastosComponent },
    { path: "contas-detalhe", component: ContasDetalheComponent },
    { path: "entradas-detalhe", component: EntradaDetalhesComponent }
];
