import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from 'express';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated) {
    return true;
  } else {
    return router.createUrlTree(['/login']);
  }
};
