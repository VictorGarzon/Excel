import { Routes } from '@angular/router';
import { Tabla } from './components/tabla/tabla';
import { Main } from './pages/main/main';
import { Home } from './pages/home/home';
import { authGuard } from './guards/auth-guard';
import { saveGuard } from './guards/save-guard';
import { Profile } from './pages/profile/profile';
import { Texto } from './components/texto/texto';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'main' },
  {
    path: 'main',
    component: Main,
    children: [
      { path: '', redirectTo: 'hoja', pathMatch: 'full' },
      { path: 'hoja', component: Tabla, canDeactivate: [saveGuard], runGuardsAndResolvers: 'always', },
      { path: 'texto', component: Texto, canDeactivate: [saveGuard], runGuardsAndResolvers: 'always', },
      { path: '**', redirectTo: 'hoja' }
    ],
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
  { path: '**', redirectTo: 'main' },
];
