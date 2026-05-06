import { Routes } from '@angular/router';
import { Tabla } from './components/tabla/tabla';
import { Main } from './pages/main/main';
import { Home } from './components/home/home';
import { authGuard } from './guards/auth-guard';
import { saveGuard } from './guards/save-guard';
import { Profile } from './components/profile/profile';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/main' },
  {
    path: 'main',
    component: Tabla,
    canDeactivate: [saveGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/main' },
];
