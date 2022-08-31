import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndividualDashboardComponent } from './individual-dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { IndividualDashboardRoutingModule } from './individual-dashboard.routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, IndividualDashboardRoutingModule],
  declarations: [IndividualDashboardComponent],
})
export class IndividualDashboardModule {}
