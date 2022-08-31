import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeapartmentTeamsComponent } from './components/deapartment-teams/deapartment-teams.component';
import { DepartmentEmployeesComponent } from './components/department-employees/department-employees.component';
import { DepartmentManagerTasksComponent } from './components/department-manager-tasks/department-manager-tasks.component';

const routes: Routes = [
  { path: 'tasks', component: DepartmentManagerTasksComponent },
  { path: 'teams/:deptId', component: DeapartmentTeamsComponent },
  { path: 'employees/:deptId', component: DepartmentEmployeesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [],
})
export class DepartmentManagerRoutingModule {}
