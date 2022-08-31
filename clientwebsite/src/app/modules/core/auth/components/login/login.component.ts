import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SiteInfo } from 'src/app/modules/shared/models/site-info';
import { Subscription } from 'src/app/modules/shared/models/subscription';

import { ErrorService } from '../../../services/error.service';
import { LocalStorageServiceService } from '../../../services/local-storage-service.service';
import { SubscriptionService } from '../../../services/subscription.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  accountsForm!: FormGroup;
  subscriptions!: Subscription[];
  site!: SiteInfo;
  message: any = 'لقد تم إرسال كود تفعيل الحساب علي البريد الألكتروني التالي';

  @ViewChild('verify') verify!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServices: AuthService,
    private subscriptionService: SubscriptionService,
    private errorService: ErrorService,
    private localService: LocalStorageServiceService
  ) {
    this.form = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });

    this.accountsForm = this.fb.group({
      type: [null, Validators.required],
    });

    this.site = this.localService.SiteSettings;
  }

  ngOnInit() {
    this.subscriptionService.getAll();
    this.subscriptionService.getUpdates().subscribe((data: any) => {
      this.subscriptions = [...data];
    });
  }

  public get Email(): FormControl {
    return this.form.get('email') as FormControl;
  }
  public get Password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  public get Type(): FormControl {
    return this.accountsForm.get('type') as FormControl;
  }

  onSubmit() {
    if (this.form.valid) {
      this.authServices.login(this.Email.value, this.Password.value).subscribe(
        (res) => {
          if (res) {
            this.verify.nativeElement.click();
            this.message = res;
          } else {
            this.authServices.user.subscribe((data) => {
              let id: string = data?.getUserId();
              localStorage.setItem('userId', id);
              this.navigateToDashboard();
            });
          }
        },
        (err: any) => {
          this.errorService.handleError(err);
        }
      );
    }
  }

  navigateToForms() {
    let subType;

    if (this.accountsForm.valid) {
      if (this.Type.value == 'company') {
        subType = this.subscriptions.find((s) => s.subscriptionType?.id == 1);
        this.router.navigateByUrl('/auth/register/company-owner', {
          state: subType,
        });
      }

      if (this.Type.value == 'provider') {
        subType = this.subscriptions.find((s) => s.subscriptionType?.id == 2);
        this.router.navigateByUrl('/auth/register/vendor-company', {
          state: subType,
        });
      }

      if (this.Type.value == 'individual') {
        subType = this.subscriptions.find((s) => s.subscriptionType?.id == 3);
        this.router.navigateByUrl('/auth/register/individual', {
          state: subType,
        });
      }
    }
  }

  navigateToDashboard() {
    this.authServices.user.subscribe((user: any) => {
      let role: string = user.getRole();

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

  navigateToVerify() {
    this.router.navigate(['/auth/verify-code', this.Email.value], {
      state: this.message.code,
    });
  }
}
