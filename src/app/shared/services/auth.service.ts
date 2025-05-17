import { Injectable } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  authState,
  User,
  UserCredential,
  updateProfile
} from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Observable<User | null>;
  
  constructor(
    private auth: Auth,
    private router: Router
  ) {
    this.currentUser$ = authState(this.auth);
  }
  
  async signIn(email: string, password: string): Promise<UserCredential> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      this.updateLoginStatus(true);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  async register(email: string, password: string, displayName: string): Promise<UserCredential> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(result.user, { displayName });
      this.updateLoginStatus(true);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.updateLoginStatus(false);
      this.router.navigate(['/login']);
    } catch (error) {
      throw error;
    }
  }
  
  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }
  
  private updateLoginStatus(isLoggedIn: boolean): void {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }
  
  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      switchMap(user => {
        return of(!!user);
      })
    );
  }
}