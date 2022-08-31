import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionTypesService } from '../Subscription-Types.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-CreateSubscription-term',
  templateUrl: './CreateSubscription-term.component.html',
  styleUrls: ['./CreateSubscription-term.component.css'],
})
export class CreateSubscriptionTermComponent implements OnInit {
  attachmentForm: FormGroup;
  subscriptionTypeId: string;
  constructor(
    private subscriptionService: SubscriptionTypesService,
    private fb: FormBuilder,
    private ar: ActivatedRoute,
    private router: Router,
    private _location: Location
  ) {
    this.attachmentForm = this.fb.group({
      termsContent: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.subscriptionTypeId = this.ar.snapshot.paramMap.get('id');
  }

  public get TermsContent(): FormControl {
    return this.attachmentForm.get('termsContent') as FormControl;
  }
  onSubmit() {
    let model = this.attachmentForm.value;
    model.subscriptionTypeId = this.subscriptionTypeId;
    console.log(model);

    this.subscriptionService.createAttachment(model);
    this._location.back();
  }
}
