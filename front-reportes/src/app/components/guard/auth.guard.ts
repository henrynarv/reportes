import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const session = sessionStorage.getItem('user')
  const router = inject(Router);
  if (session) {
    return true;

  }
  return router.createUrlTree(['/login']);
};
