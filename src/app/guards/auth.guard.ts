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
  //Comprobar si el token ha expirado
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiration = payload.exp;
  const now = Date.now() / 1000;
  if (now > expiration) {
    //Token ha expirado, redirigir a la página de inicio de sesión
    localStorage.removeItem('jwt');
    window.location.href = '/auth';
    return false;
  }
  return true;
};
