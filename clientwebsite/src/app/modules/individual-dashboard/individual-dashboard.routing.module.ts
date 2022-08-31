import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndividualDashComponent } from './components/individual-dash/individual-dash.component';
import { IndividualDashboardComponent } from './individual-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: IndividualDashboardComponent,
    children: [
      {
        path: '',
        component: IndividualDashComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndividualDashboardRoutingModule {}
