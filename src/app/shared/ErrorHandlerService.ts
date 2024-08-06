import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private translate: TranslateService,
    private router: Router
  ) {}

  checkRole(role : string) : void{
    //Si tiene el rol de administrador, podrá acceder a la vista de creación de artistas. Extraer el rol del jwt almacenado en el localStorage.
    const token = localStorage.getItem('jwt');
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      console.log(tokenPayload);
      //si el array de roles no contiene el rol de administrador, se redirige a la página de inicio.
      if (!tokenPayload.roles.includes(role)) {
        this.handleError({ status: 403 });
      }
    } else {
      this.handleError({ status: 403 });
    }
  }
  handleError(error: any): void {
    if (error.status === 403) {
      this.translate.get(['ERROR', 'NO_PERMISOS', 'REDIRECT_URL']).subscribe(translations => {
        Swal.fire({
          icon: 'error',
          title: translations['ERROR'],
          text: translations['NO_PERMISOS'],
          confirmButtonText: 'OK',
        }).then((result) => {
            this.router.navigateByUrl('/dashboard');

        });
      });
    } else {
      console.error('Error:', error);
    }
  }
}
