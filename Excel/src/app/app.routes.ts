import { Routes } from '@angular/router';
import { Tabla } from './components/tabla/tabla';
import { Login } from './components/login/login';

export const routes: Routes = [

    { path: '', redirectTo: "tabla", pathMatch: "full" },
    { path: 'tabla', component: Tabla },
    { path: 'login', component: Login },
];
