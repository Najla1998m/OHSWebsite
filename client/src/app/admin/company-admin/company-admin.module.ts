import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompanyAdminRoutingModule } from './company-admin-routing.module';
import { UsersComponent } from './users/users.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserDetailsComponent } from './users/user-details/user-details.component';
import { PrimeNGModule } from 'src/app/primeng.module';
import { SharedModule } from 'src/app/shared.module';
import { UserItemComponent } from './users/users-list/user-item/user-item.component';
import {TableModule} from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    UsersComponent,
    UsersListComponent,
    UserDetailsComponent,
    UserItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CompanyAdminRoutingModule,
    PrimeNGModule,
    SharedModule,
    TableModule,
    DropdownModule
  ],
})
export class CompanyAdminModule { }
