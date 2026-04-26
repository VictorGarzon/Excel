import { Routes } from '@angular/router';
import { Tabla } from './components/tabla/tabla';
import { Main } from './pages/main/main';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/main' },
  {
    path: 'main',
    //loadChildren: () => import('./pages/welcome/welcome.routes').then((m) => m.WELCOME_ROUTES),
    component: Tabla
  },
  { path: '**', pathMatch: 'full', redirectTo: '/main' },
];
