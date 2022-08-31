import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminComponent } from './admin.component';
import { CompanyAdminComponent } from './company-admin/company-admin.component';
import { SupplierAdminComponent } from './supplier-admin/supplier-admin.component';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PageCardComponent } from './admin-panel/static-pages/page-card/page-card.component';

@NgModule({
  declarations: [AdminComponent, CompanyAdminComponent, SupplierAdminComponent],
  imports: [CommonModule, AdminRoutingModule, MenuModule, MenubarModule],
})
export class AdminModule {}
