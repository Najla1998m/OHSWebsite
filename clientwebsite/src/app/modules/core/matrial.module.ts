import { NgModule } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  imports: [MatStepperModule, MatButtonModule, NgxSliderModule],
  exports: [MatStepperModule, MatButtonModule, NgxSliderModule],
  providers: [],
})
export class MartialModule {}
