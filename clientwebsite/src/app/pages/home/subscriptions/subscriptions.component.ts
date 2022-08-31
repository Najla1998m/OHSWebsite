import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss'],
})
export class SubscriptionsComponent implements OnInit {
  accountsForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.accountsForm = this.fb.group({
      type: [null, Validators.required],
    });
  }

  ngOnInit() {}

  public get Type(): FormControl {
    return this.accountsForm.get('type') as FormControl;
  }

  navigateToForms() {
    if (this.accountsForm.valid) {
      if (this.Type.value == 'provider') {
        this.router.navigateByUrl('/auth/register/vendor-company');
      }

      if (this.Type.value == 'individual') {
        this.router.navigateByUrl('/auth/register/individual');
      }
    }
  }
}
