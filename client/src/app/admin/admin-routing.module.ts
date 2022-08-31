import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { AdminComponent } from './admin.component';
import { CompanyAdminComponent } from './company-admin/company-admin.component';
import { SupplierAdminComponent } from './supplier-admin/supplier-admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'admin-panel',
    loadChildren: () =>
    import('./admin-panel/admin-panel.module').then(
      (m) => m.AdminPanelModule
    ),
  },
  {
    path: 'company-admin',
    loadChildren: () =>
      import('./company-admin/company-admin.module').then(
        (m) => m.CompanyAdminModule
      ),
  },
  {
    path: 'supplier-admin',
    component: SupplierAdminComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
