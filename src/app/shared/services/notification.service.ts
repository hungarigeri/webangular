import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  showAuthRequiredMessage() {
    this.snackBar.open('Bejelentkezés szükséges az oldal megtekintéséhez!', 'Bezár', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}