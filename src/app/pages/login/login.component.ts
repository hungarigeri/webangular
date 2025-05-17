import { Component, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterLink,
    MatCardContent,
    MatCard,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(6)]);
  
  loading = false;
  errorMessage = '';
  authSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async login() {
    if (this.email.invalid || this.password.invalid) {
      this.errorMessage = 'Kérjük töltsd ki az összes mezőt helyesen!';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const email = this.email.value || '';
      const password = this.password.value || '';
      
      await this.authService.signIn(email, password);
      
      this.snackBar.open('Sikeres bejelentkezés!', 'Bezár', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Bejelentkezési hiba:', error);
      this.handleError(error);
    } finally {
      this.loading = false;
    }
  }

  private handleError(error: any): void {
    switch(error.code) {
      case 'auth/user-not-found':
        this.errorMessage = 'Nem található felhasználó ezzel az email címmel';
        break;
      case 'auth/wrong-password':
        this.errorMessage = 'Hibás jelszó';
        break;
      case 'auth/invalid-credential':
        this.errorMessage = 'Érvénytelen email cím vagy jelszó';
        break;
      case 'auth/too-many-requests':
        this.errorMessage = 'Túl sok sikertelen próbálkozás. Kérjük várj egy kicsit!';
        break;
      default:
        this.errorMessage = 'Ismeretlen hiba történt, kérjük próbáld újra később';
    }
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }
}