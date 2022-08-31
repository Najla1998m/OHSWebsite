import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyDashboardComponent } from './company-dashboard.component';
import { CompanyDashboardRoutingModule } from './company-dashboard.routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashComponent } from './components/dash/dash.component';
import { ManagementsComponent } from './components/managements/managements.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { DashboardOperationsComponent } from './components/dashboard-operations/dashboard-operations.component';
import { PollFormComponent } from './components/poll-form/poll-form.component';
import { PollDetailsComponent } from './components/poll-details/poll-details.component';
import { PollActionComponent } from './components/poll-action/poll-action.component';
import { PollActionCardComponent } from './components/poll-action/poll-action-card/poll-action-card.component';
import { ManagementTasksComponent } from './management-tasks/management-tasks.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';

@NgModule({
  imports: [CommonModule, CompanyDashboardRoutingModule, SharedModule],
  declarations: [
    CompanyDashboardComponent,
    DashComponent,
    ManagementsComponent,
    DepartmentsComponent,
    TasksComponent,
    TaskDetailsComponent,
    EmployeesComponent,
    EmployeeDashboardComponent,
    DashboardOperationsComponent,
    PollFormComponent,
    PollDetailsComponent,
    PollActionComponent,
    PollActionCardComponent,
    ManagementTasksComponent,
  ],
})
export class CompanyDashboardModule {}
