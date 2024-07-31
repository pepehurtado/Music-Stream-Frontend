import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  if (state.url === '/auth' || state.url === '/auth/register') {
    return true;
  }


  //Si no hay token, redirigir a la página de inicio de sesión
  if (!userService.getToken()) {
      window.location.href = '/auth';
    return false;
  }

  if (userService.isTokenExpired()) {
    userService.handleTokenExpiration();
    return false;
  }

  return true;
};
