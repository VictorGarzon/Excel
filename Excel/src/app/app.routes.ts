import { Routes } from '@angular/router';
import { Tabla } from './components/tabla/tabla';
import { Main } from './pages/main/main';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth-guard';
import { saveGuard } from './guards/save-guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/main' },
  {
    path: 'main',
    component: Tabla,
    canDeactivate: [saveGuard]
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/main' },
];
