import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyVendorDashboardComponent } from './company-vendor-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { CompanyVendorDashboardRoutingModule } from './company-vendor-dashboard.routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, CompanyVendorDashboardRoutingModule],
  declarations: [CompanyVendorDashboardComponent],
})
export class CompanyVendorDashboardModule {}
