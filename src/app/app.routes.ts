import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DespesasComponent } from './pages/despesas/despesas.component';

export const routes: Routes = [
    {
        path:"",
        component: HomeComponent
    },
    {
        path: "despesas",
        component: DespesasComponent
    }
];
