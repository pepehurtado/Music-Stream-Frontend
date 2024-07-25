import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('jwt');
  //Si la pagina es /user, no se necesita un token
  console.log('URL:', state.url);
  if (state.url === '/user' || state.url === '/user/register') {
    return true;
  }
  if (!token) {
    //Redirigir a la página de inicio de sesión si no hay token
    window.location.href = '/user';
    return false;
  }
  return true;
};
