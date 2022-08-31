import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { CheckAccountComponent } from './components/check-account/check-account.component';
import { CompanyOwnerRegisterComponent } from './components/company-owner-register/company-owner-register.component';
import { IndividualRegisterComponent } from './components/individual-register/individual-register.component';
import { LoginComponent } from './components/login/login.component';
import { OtpComponent } from './components/otp/otp.component';
import { SetNewPasswordComponent } from './components/set-new-password/set-new-password.component';
import { VendorRegisterComponent } from './components/vendor-register/vendor-register.component';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register/company-owner',
        component: CompanyOwnerRegisterComponent,
      },
      {
        path: 'register/individual',
        component: IndividualRegisterComponent,
      },
      {
        path: 'register/vendor-company',
        component: VendorRegisterComponent,
      },
      {
        path: 'verify-code/:email',
        component: OtpComponent,
      },
      {
        path: 'check-account/verify-code/:email',
        component: OtpComponent,
      },
      {
        path: 'check-account',
        component: CheckAccountComponent,
      },
      {
        path: 'set-password',
        component: SetNewPasswordComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
