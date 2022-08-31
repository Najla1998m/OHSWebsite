import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../Auth.service';

@Component({
  selector: 'app-verify-code',
  templateUrl: './verify-code.component.html',
  styleUrls: ['./verify-code.component.scss'],
})
export class VerifyCodeComponent implements OnInit {
  form: FormGroup;
  email: string;
  codee: any;
  constructor(
    private fb: FormBuilder,
    private ar: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
    this.ar.params.subscribe((res) => {
      console.log(res);
      this.email = res.email;
    });
    this.form = this.fb.group({
      code: [null, [Validators.required]],
    });
    let codex = this.router.getCurrentNavigation()?.extras.state;
    window.alert(codex);

    this.Code.patchValue(codex);
  }

  ngOnInit() {}

  public get Code(): FormControl {
    return this.form.get('code') as FormControl;
  }

  onSubmit() {
    let model = this.form.value;
    model.email = this.email;
    console.log(model);

    this.auth.verifySignInCode(model);
  }
}
