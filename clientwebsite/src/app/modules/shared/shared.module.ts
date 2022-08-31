import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [SafeUrlPipe],
  imports: [CommonModule, CoreModule],
  exports: [SafeUrlPipe, CommonModule, CoreModule],
})
export class SharedModule {}
