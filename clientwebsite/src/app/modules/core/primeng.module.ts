import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ChartModule } from 'primeng/chart';
import { PasswordModule } from 'primeng/password';
import { SliderModule } from 'primeng/slider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { KnobModule } from 'primeng/knob';
import { TooltipModule } from 'primeng/tooltip';

const elements = [
  SkeletonModule,
  ToastModule,
  DropdownModule,
  AvatarModule,
  BadgeModule,
  ChartModule,
  PasswordModule,
  SliderModule,
  InputSwitchModule,
  OverlayPanelModule,
  KnobModule,
  TooltipModule,
];

@NgModule({
  imports: [elements],
  exports: [elements],
  providers: [MessageService],
})
export class PrimengModule {}
