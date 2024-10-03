import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = sessionStorage.getItem('user');//o el metodo que uses para verificar la


  if (user) {
    return router.createUrlTree(['/home']);
  } else {
    // Si no está autenticado, permitir el acceso a la página de login
    return true;
  }

};
