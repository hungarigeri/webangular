import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule, 
    MatListModule, 
    MatDividerModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  menuActive = false;
  isLoggedIn$: Observable<boolean> | undefined;
  currentUser$: Observable<User | null> | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoggedIn$ = this.authService.isAuthenticated();
    this.currentUser$ = this.authService.getCurrentUser();
  }

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
  }

  logout(): void {
    this.authService.signOut();
    this.menuActive = false;
  }
}