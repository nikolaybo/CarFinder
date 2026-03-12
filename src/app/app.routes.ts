import { Routes } from '@angular/router';
import { authGuard } from './guard/guard.guard';
import { guestGuard } from './guard/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/homepage/homepage.component').then(m => m.HomepageComponent),
    data: { title: 'Homepage', showInNavbar: false, showInFooter: false },
    // canActivate: [authGuard],
  },
  {
    path: 'car-view/:id',
    loadComponent: () =>
      import('./components/car-list/car-view/car-view.component').then(m => m.CarViewComponent),
    data: { title: 'Car View', showInNavbar: false, showInFooter: false },
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/user/login/login.component').then(m => m.LoginComponent),
    data: { title: 'Log in', showInNavbar: true, showInFooter: false },
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/user/register/register.component').then(m => m.RegisterComponent),
    data: { title: 'Register', showInNavbar: true, showInFooter: false },
    canActivate: [guestGuard],
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/user/profile/profile.component').then(m => m.ProfileComponent),
    data: { title: 'Profile', showInNavbar: true, showInFooter: false },
    // canActivate: [authGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/global/page-not-found/page-not-found.component').then(
        m => m.PageNotFoundComponent
      ),
  },
];
