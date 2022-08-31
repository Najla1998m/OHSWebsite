import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SiteInfo } from 'src/app/modules/shared/models/site-info';
import { ErrorService } from '../../../services/error.service';
import { LocalStorageServiceService } from '../../../services/local-storage-service.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-check-account',
  templateUrl: './check-account.component.html',
  styleUrls: ['./check-account.component.scss'],
})
export class CheckAccountComponent implements OnInit {
  site!: SiteInfo;
  accountForm!: FormGroup;
  @ViewChild(FormGroupDirective) form!: FormGroupDirective;

  constructor(
    private localService: LocalStorageServiceService,
    private fb: FormBuilder,
    private authService: AuthService,
    private errorService: ErrorService,
    private router: Router
  ) {
    this.accountForm = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
    });
  }

  public get Email(): FormControl {
    return this.accountForm.get('email') as FormControl;
  }

  ngOnInit() {
    this.site = this.localService.SiteSettings;
  }

  onSubmit() {
    if (this.accountForm.valid) {
      this.authService.getResetPasswordToken(this.Email.value).subscribe(
        (data: any) => {
          this.router.navigate(
            ['/auth/check-account/verify-code', this.Email.value],
            { state: data?.data }
          );
          this.form.resetForm();
        },
        (error) => {
          this.errorService.handleError(error);
        }
      );
    }
  }
}
