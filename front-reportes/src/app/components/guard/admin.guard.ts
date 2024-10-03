import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AutenticacionService } from 'src/app/services/autenticacion.service';

export const adminGuard: CanActivateFn = (route, state) => {

  const authService = inject(AutenticacionService);
  const router = inject(Router);
  if (authService.isAdmin()) {
    return true;
  } else {
    router.navigate(['/no-autorizado'])
    return false;
  }
};
