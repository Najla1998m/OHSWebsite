import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';

import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PackagesComponent } from './pages/packagesPage/packages.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'about/:id',
    component: AboutComponent,
  },

  {
    path: 'packages',
    component: PackagesComponent,
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/core/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'company-dashboard',
    loadChildren: () =>
      import('./modules/company-dashboard/company-dashboard.module').then(
        (m) => m.CompanyDashboardModule
      ),
  },
  {
    path: 'company-vendor-dashboard',
    loadChildren: () =>
      import(
        './modules/company-vendor-dashboard/company-vendor-dashboard.module'
      ).then((m) => m.CompanyVendorDashboardModule),
  },
  {
    path: 'individual-dashboard',
    loadChildren: () =>
      import('./modules/individual-dashboard/individual-dashboard.module').then(
        (m) => m.IndividualDashboardModule
      ),
  },

  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
