import { Routes } from '@angular/router';
import { Tabla } from './components/tabla/tabla';

export const routes: Routes = [

    { path: '', redirectTo: "tabla", pathMatch: "full" },
    { path: 'tabla', component: Tabla },
];
