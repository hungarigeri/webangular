import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../shared/services/auth.service';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
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
    MatIcon,
    
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    name: new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)])
    })
  });

  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Kérjük töltsd ki az összes mezőt helyesen!';
      return;
    }

    const password = this.registerForm.value.password;
    const confirmPassword = this.registerForm.value.confirmPassword;

    if (password !== confirmPassword) {
      this.errorMessage = 'A jelszavak nem egyeznek!';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    try {
      const email = this.registerForm.value.email || '';
      const password = this.registerForm.value.password || '';
      const firstName = this.registerForm.value.name?.firstName || '';
      const lastName = this.registerForm.value.name?.lastName || '';

      await this.authService.register(email, password, `${firstName} ${lastName}`);
      
      this.snackBar.open('Sikeres regisztráció!', 'Bezár', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Regisztrációs hiba:', error);
      this.handleError(error);
    } finally {
      this.loading = false;
    }
  }
    private handleError(error: any): void {
    switch(error.code) {
      case 'auth/email-already-in-use':
        this.errorMessage = 'Ez az email cím már használatban van';
        break;
      case 'auth/invalid-email':
        this.errorMessage = 'Érvénytelen email cím';
        break;
      case 'auth/weak-password':
        this.errorMessage = 'A jelszónak legalább 6 karakter hosszúnak kell lennie';
        break;
      default:
        this.errorMessage = 'Ismeretlen hiba történt, kérjük próbáld újra később';
    }
  }
}
