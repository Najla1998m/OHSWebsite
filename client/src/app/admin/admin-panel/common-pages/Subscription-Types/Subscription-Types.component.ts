import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Subscription,
  subscriptionTypeDto,
} from 'src/app/admin/models/subscriptionType';
import { SubscriptionTypesService } from './Subscription-Types.service';

@Component({
  selector: 'app-Subscription-Types',
  templateUrl: './Subscription-Types.component.html',
  styleUrls: ['./Subscription-Types.component.css'],
})
export class SubscriptionTypesComponent implements OnInit {
  listSubscription: Subscription[] = [];
  displayForm: boolean;
  selected: Subscription;
  termsAndCondition: any;
  attachmentForm: FormGroup;
  constructor(
    private subscriptionService: SubscriptionTypesService,
    private fb: FormBuilder
  ) {
    this.attachmentForm = this.fb.group({
      termsContent: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.subscriptionService.getAllSubscriptionType();
    this.subscriptionService.getUpdates().subscribe((res) => {
      this.listSubscription = [...res];
      console.log(this.listSubscription);
    });
  }

  public get TermsContent(): FormControl {
    return this.attachmentForm.get('termsContent') as FormControl;
  }

  showForm(selected: Subscription) {
    this.displayForm = true;
    this.selected = selected;

    this.subscriptionService
      .getTermsById(this.selected.subscriptionType.id)
      .subscribe((res: any) => {
        this.termsAndCondition = res;
      });
  }
  showDetails(id: number) {}
  onSubmit() {}
  resetForm() {}
}
