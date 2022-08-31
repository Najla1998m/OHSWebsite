import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { CoreModule } from '../core.module';
import { SharedModule } from '../../shared/shared.module';
import { AuthRoutingModule } from './auth.routing.module';
import { CompanyOwnerRegisterComponent } from './components/company-owner-register/company-owner-register.component';
import { VendorRegisterComponent } from './components/vendor-register/vendor-register.component';
import { IndividualRegisterComponent } from './components/individual-register/individual-register.component';
import { OtpComponent } from './components/otp/otp.component';
import { CheckAccountComponent } from './components/check-account/check-account.component';
import { SetNewPasswordComponent } from './components/set-new-password/set-new-password.component';

@NgModule({
  imports: [CommonModule, CoreModule, SharedModule, AuthRoutingModule],
  declarations: [
    AuthComponent,
    LoginComponent,
    CompanyOwnerRegisterComponent,
    VendorRegisterComponent,
    IndividualRegisterComponent,
    OtpComponent,
    CheckAccountComponent,
    SetNewPasswordComponent,
  ],
})
export class AuthModule {}
