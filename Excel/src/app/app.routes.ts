import { Routes } from '@angular/router';
import { Tabla } from './components/tabla/tabla';
import { Main } from './pages/main/main';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/main' },
  {
    path: 'main',
    //loadChildren: () => import('./pages/welcome/welcome.routes').then((m) => m.WELCOME_ROUTES),
    component: Tabla
  },
  {
    path: 'home',
    component: Home,
    canActivate:[authGuard]
  },
  { path: '**', pathMatch: 'full', redirectTo: '/main' },
];
