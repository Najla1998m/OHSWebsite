import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadAttachmentsComponent } from 'src/app/pages/upload-attachments/upload-attachments.component';
import { CompanyDashboardComponent } from './company-dashboard.component';
import { DashComponent } from './components/dash/dash.component';
import { DashboardOperationsComponent } from './components/dashboard-operations/dashboard-operations.component';
import { DepartmentsComponent } from './components/departments/departments.component';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ManagementsComponent } from './components/managements/managements.component';
import { PollActionComponent } from './components/poll-action/poll-action.component';
import { PollDetailsComponent } from './components/poll-details/poll-details.component';
import { PollFormComponent } from './components/poll-form/poll-form.component';
import { TaskDetailsComponent } from './components/task-details/task-details.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ManagementTasksComponent } from './management-tasks/management-tasks.component';

const routes: Routes = [
  {
    path: '',
    component: CompanyDashboardComponent,
    children: [
      { path: '', redirectTo: 'dash', pathMatch: 'full' },
      { path: 'dash', component: DashComponent },
      { path: 'managements', component: ManagementsComponent },
      { path: 'departments', component: DepartmentsComponent },
      { path: 'upload-attachments', component: UploadAttachmentsComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'employees/:id', component: EmployeesComponent },
      { path: 'employee-dashboard', component: EmployeeDashboardComponent },
      { path: 'dashboard-operations', component: DashboardOperationsComponent },
      { path: 'poll/:id', component: PollFormComponent },
      { path: 'poll-details/:id/:number', component: PollDetailsComponent },
      { path: 'poll-action/:id', component: PollActionComponent },
      { path: 'management-task', component: ManagementTasksComponent },
      { path: 'task-details/:id', component: TaskDetailsComponent },
      {
        path: 'department-manager',
        loadChildren: () =>
          import('./department-manager/department-manager.module').then(
            (m) => m.DepartmentManagerModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyDashboardRoutingModule {}
