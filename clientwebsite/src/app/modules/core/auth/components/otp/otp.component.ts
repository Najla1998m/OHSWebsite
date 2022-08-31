import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { SiteInfo } from 'src/app/modules/shared/models/site-info';
import { ErrorService } from '../../../services/error.service';
import { LocalStorageServiceService } from '../../../services/local-storage-service.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  site!: SiteInfo;
  codeForm!: FormGroup;
  email!: string;
  loginMode!: boolean;

  constructor(
    private localService: LocalStorageServiceService,
    private fb: FormBuilder,
    private ar: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private errorService: ErrorService
  ) {
    this.codeForm = this.fb.group({
      code: [null, [Validators.required]],
    });

    let code = this.router.getCurrentNavigation()?.extras.state;
    this.Code.patchValue(code);
  }

  ngOnInit() {
    this.site = this.localService.SiteSettings;
    this.ar.params.subscribe((url) => {
      this.email = url.email;
      if (this.router.url.includes('check-account')) {
        this.loginMode = false;
      } else {
        this.loginMode = true;
      }
    });
  }

  public get Code(): FormControl {
    return this.codeForm.get('code') as FormControl;
  }

  onSubmit() {
    let model = {
      code: this.Code.value,
      email: this.email,
    };

    if (this.loginMode) {
      this.authService.verifySignInCode(model).subscribe((res) => {
        this.authService.user.subscribe(
          (data) => {
            let id: string = data?.getUserId();
            localStorage.setItem('userId', id);
            this.navigateToDashboard();
          },
          (err) => {
            this.errorService.handleError(err);
          }
        );
      });
    } else {
      this.authService.GetResetPasswordToken(model).subscribe((data: any) => {
        let res = { email: this.email, token: data?.data };
        this.router.navigate(['/auth/set-password'], { state: res });
      });
    }
  }

  navigateToDashboard() {
    this.authService.user.pipe(take(1)).subscribe((user: any) => {
      let role: string = user?.getRole();

      if (role.includes('Company') && !role.includes('Vendor')) {
        this.router.navigate(['/company-dashboard/dash']);
      }

      if (role.includes('Company') && role.includes('Vendor')) {
        this.router.navigate(['/company-dashboard/dash']);
      }

      if (role.includes('Individual')) {
        this.router.navigate(['/company-dashboard/dash']);
      }
    });
  }
}
