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
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Observable<User | null>;
  
  constructor(
    private auth: Auth,
    private firestore: Firestore,
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
  
  async register(
    email: string, 
    password: string, 
    displayName: string,
    firstName: string,
    lastName: string
  ): Promise<UserCredential> {
    try {
      // 1. Create user in Firebase Authentication
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // 2. Update user profile with display name
      await updateProfile(result.user, { displayName });
      
      // 3. Save additional user data to Firestore
      await this.saveUserDataToFirestore(result.user.uid, email, firstName, lastName);
      
      this.updateLoginStatus(true);
      return result;
    } catch (error) {
      throw error;
    }
  }
  
  private async saveUserDataToFirestore(
    uid: string,
    email: string,
    firstName: string,
    lastName: string
  ): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      await setDoc(userRef, {
        id: uid,
        email: email,
        name: {
          firstname: firstName,
          lastname: lastName
        },
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving user data to Firestore:', error);
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