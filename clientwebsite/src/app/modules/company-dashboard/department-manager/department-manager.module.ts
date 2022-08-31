import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { DepartmentManagerRoutingModule } from './department-manager.routing.module';
import { DepartmentManagerTasksComponent } from './components/department-manager-tasks/department-manager-tasks.component';
import { DepartmentEmployeesComponent } from './components/department-employees/department-employees.component';
import { DeapartmentTeamsComponent } from './components/deapartment-teams/deapartment-teams.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    DepartmentManagerRoutingModule,
    RouterModule,
  ],
  declarations: [
    DepartmentManagerTasksComponent,
    DepartmentEmployeesComponent,
    DeapartmentTeamsComponent,
  ],
})
export class DepartmentManagerModule {}
