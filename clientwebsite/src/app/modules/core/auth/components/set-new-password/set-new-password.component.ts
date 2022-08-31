import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SiteInfo } from 'src/app/modules/shared/models/site-info';
import { LocalStorageServiceService } from '../../../services/local-storage-service.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.scss'],
})
export class SetNewPasswordComponent implements OnInit {
  site!: SiteInfo;
  resetToken!: string;
  passwordForm!: FormGroup;
  accountInfo!: any;

  constructor(
    private localService: LocalStorageServiceService,
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.accountInfo = this.router.getCurrentNavigation()?.extras.state;
    this.passwordForm = this.fb.group({
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.site = this.localService.SiteSettings;
  }

  public get Password(): FormControl {
    return this.passwordForm.get('password') as FormControl;
  }

  public get ConfirmPassword(): FormControl {
    return this.passwordForm.get('confirmPassword') as FormControl;
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      let model = this.passwordForm.value;
      model.email = this.accountInfo.email;
      model.token = this.accountInfo.token;
      this.authService.VerifyResetPassword(model).subscribe(() => {
        this.router.navigate(['/auth/login']);
      });
    }
  }
}
