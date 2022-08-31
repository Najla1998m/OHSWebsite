import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionTypesTermDto } from 'src/app/admin/models/SubscriptionTypesTerm';
import { SubscriptionTypesService } from '../Subscription-Types.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-editSubscriptionTerm',
  templateUrl: './editSubscriptionTerm.component.html',
  styleUrls: ['./editSubscriptionTerm.component.css'],
})
export class EditSubscriptionTermComponent implements OnInit {
  attachmentForm: FormGroup;
  subscriptionTypeId: any;
  term: SubscriptionTypesTermDto;
  mode: string = 'add';
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
    this.subscriptionService.getTermsById(this.subscriptionTypeId).subscribe(
      (res: any) => {
        this.mode = 'edit';
        console.log(res);

        this.term = res;
        this.attachmentForm.patchValue(this.term);
      },
      (err) => {
        this.mode = 'add';
      }
    );
  }

  public get TermsContent(): FormControl {
    return this.attachmentForm.get('termsContent') as FormControl;
  }
  onSubmit() {
    if (this.attachmentForm.valid) {
      let model = this.attachmentForm.value;
      if (this.mode == 'edit') {
        model.subscriptionTypeId = this.subscriptionTypeId;
        model.id = this.term.id;
        console.log(model, 'edit');

        this.subscriptionService.updateTerms(this.term.id, model);
        this._location.back();
      } else if ((this.mode = 'add')) {
        model.subscriptionTypeId = this.subscriptionTypeId;
        this.subscriptionService.createAttachment(model);
        this._location.back();
      }
    }
  }
}
