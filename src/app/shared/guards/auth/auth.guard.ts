import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { map, take } from 'rxjs/operators';
import { NotificationService } from '../../services/notification.service';

export const authGuard: CanActivateFn = (route, state) => {
  const notify = inject(NotificationService);
  const router = inject(Router);
  const authService = inject(AuthService);
  
  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      }
      notify.showAuthRequiredMessage();
      console.log('Access denied - Not authenticated');
      router.navigate(['/login']);
      return false;
    })
  );
};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);const notify = inject(NotificationService);
  
  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (!user) {
        return true;
      }
      console.log('Already authenticated, redirecting to home');
      router.navigate(['/']);
      return false;
    })
  );
};