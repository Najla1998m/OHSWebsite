import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyVendorDashboardComponent } from './company-vendor-dashboard.component';
import { CompanyVendorDashComponent } from './components/company-vendor-dash/company-vendor-dash.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyVendorDashboardComponent,
    children: [{ path: '', component: CompanyVendorDashComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyVendorDashboardRoutingModule {}
