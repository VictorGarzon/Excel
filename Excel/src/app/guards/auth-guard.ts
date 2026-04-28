import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import {Router} from '@angular/router'
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const message = inject(MessageService)

  if (authService.isAuthenticated) {
    return true;
  } else {
    authService.logout
    router.navigate(['/main']);
    message.createBasicMessage("error","No puedes acceder")
    return false
  }
};
