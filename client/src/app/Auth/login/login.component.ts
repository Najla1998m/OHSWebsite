import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
import { AuthService } from '../Auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  error: string = null;
  message: any;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private authServices: AuthService,
    private messageService: MessageService
  ) {
    this.form = this.fb.group({
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: [null, [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {}

  public get Email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  public get Password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  onSubmit() {
    if (this.form.valid) {
      this.authServices.login(this.Email.value, this.Password.value).subscribe(
        (res) => {
          console.log(res);

          this.message = res;
          Swal.fire('success', res.message, 'success').then(() => {
            this.navigateToVerify();
          });
        },
        (err) => {
          this.showError(err);
        }
      );
    }
  }

  showError(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  navigateToVerify() {
    console.log(this.message.code, 'yala b2');

    this.route.navigate(['/verify-code', this.Email.value], {
      state: this.message.code,
    });
  }
}
