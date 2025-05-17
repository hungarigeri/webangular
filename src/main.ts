import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp({ projectId: "chef-vlog-50e19", appId: "1:964409567858:web:8839ab07e1a840e41e30eb", storageBucket: "chef-vlog-50e19.firebasestorage.app", apiKey: "AIzaSyA6lvRJZ4EAKzplFGvPs8dRsdMiPykFFXo", authDomain: "chef-vlog-50e19.firebaseapp.com", messagingSenderId: "964409567858" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()),
    // egyéb provider-ek...
  ],
}).catch((err) => console.error(err));
