import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './shared/guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'receptek',
    loadComponent: () =>
      import('./pages/receptek/receptek.component').then(
        (m) => m.ReceptekComponent
      ),
      canActivate:[authGuard]
  },
  {
    path: 'kontakt',
    loadComponent: () =>
      import('./pages/kontakt/kontakt.component').then(
        (m) => m.KontaktComponent
      ),
       canActivate:[authGuard]
  },
  {
    path: 'recept/:id',
    loadComponent: () =>
      import('./pages/recept-details/recept-details.component').then(
        (m) => m.ReceptDetailsComponent
      ),
       canActivate:[authGuard]
  },
  {
    path: 'posztok/:id',
    loadComponent: () =>
      import('./pages/posztoktartalma/posztoktartalma.component').then(
        (m) => m.PosztoktartalmaComponent
      ),
       canActivate:[authGuard]
  },
    {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
       canActivate:[publicGuard]
  },
   {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
      canActivate:[publicGuard]
  },
];
