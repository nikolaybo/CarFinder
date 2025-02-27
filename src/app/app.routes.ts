import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/user/login/login.component';
import { PageNotFoundComponent } from './components/global/page-not-found/page-not-found.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { RegisterComponent } from './components/user/register/register.component';
import { CarViewComponent } from './components/car-list/car-view/car-view.component';
import { AuthGuard } from './guard/guard.guard';
import { GuestGuard } from './guard/guest.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
    data: {
      title: "Homepage",
      showInNavbar: false,
      showInFooter: false,
    },
    canActivate: [AuthGuard],
  }, // Default route
  {
    path: 'car-view/:id',
    component: CarViewComponent,
    data: {
      title: "Car View",
      showInNavbar: false,
      showInFooter: false,
    },
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: "Log in",
      showInNavbar: true,
      showInFooter: false,
    },
    canActivate: [GuestGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: "Register",
      showInNavbar: true,
      showInFooter: false,
    },
    canActivate: [GuestGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    data: {
      title: "Profile",
      showInNavbar: true,
      showInFooter: false,
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'favorite', // child route path
        component: ProfileComponent, // child route component that the router renders
      },
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
    component: PageNotFoundComponent,
  }, // Fallback
];
