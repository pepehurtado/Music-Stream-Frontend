import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('jwt');
  //Si la pagina es /auth, no se necesita un token
  console.log('URL:', state.url);
  if (state.url === '/auth' || state.url === '/auth/register') {
    return true;
  }
  if (!token) {
    //Redirigir a la página de inicio de sesión si no hay token
    window.location.href = '/auth';
    return false;
  }
  return true;
};
