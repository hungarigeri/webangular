import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      { path: 'receptek',
        loadComponent: () => import('./pages/receptek/receptek.component').then(m => m.ReceptekComponent)
      },
      { path: 'kontakt',
        loadComponent: () => import('./pages/kontakt/kontakt.component').then(m => m.KontaktComponent)
      },
      { 
        path: 'recept/:id', 
        loadComponent: () => import('./pages/recept-details/recept-details.component').then(m => m.ReceptDetailsComponent)
      },
      { path: 'posztok/:id', loadComponent: () => import('./pages/posztoktartalma/posztoktartalma.component').then(m => m.PosztoktartalmaComponent) }
    ]