import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ErrorService } from 'src/app/modules/core/services/error.service';
import { LocalStorageServiceService } from 'src/app/modules/core/services/local-storage-service.service';
import Swal from 'sweetalert2';
import { PollItem } from '../../models/poll-item.model';
import { RiskMangmentServicesService } from '../../services/risk-mangment-services.service';

@Component({
  selector: 'app-poll-form',
  templateUrl: './poll-form.component.html',
  styleUrls: ['./poll-form.component.scss'],
})
export class PollFormComponent implements OnInit {
  pollItems!: PollItem[];
  pollForm!: FormGroup;
  userId!: string;
  pollId!: number;

  constructor(
    private pollServices: RiskMangmentServicesService,
    private fb: FormBuilder,
    private localServices: LocalStorageServiceService,
    private ar: ActivatedRoute,
    private router: Router,
    private errorHandler: ErrorService
  ) {
    this.pollForm = this.fb.group({
      polls: fb.array([]),
    });
  }

  ngOnInit() {
    this.userId = this.localServices.UserId;
    this.ar.params.subscribe((url) => {
      this.pollId = url.id;
      this.pollServices.GetPollDetailsByPollId(this.pollId).subscribe(
        (data: any) => {
          console.log(data);

          this.pollItems = [...data[0].pollItems];
          this.addCheckBoxes(this.Polls, this.pollItems);
        },
        (err) => {
          console.log(err);
        }
      );
    });
  }

  public get Polls(): FormArray {
    return this.pollForm.get('polls') as FormArray;
  }

  private addCheckBoxes(form: FormArray, arr: any) {
    arr.forEach(() => {
      form.push(new FormControl(false));
    });
  }

  onSubmit() {
    let selected: any[] = this.pollForm.value.polls;
    let model: any[] = [];
    selected.forEach((e, i) => {
      let poll = this.pollItems[i];
      model.push({
        pollItemId: poll.id,
        pollId: +this.pollId,
        pollItemValue: e,
        appUserId: this.userId,
      });
    });

    console.log(model);

    if (model.length == 0) {
      this.pollForm.setErrors({ require: true });
    } else {
      this.pollServices.CreatePollDetails(model).subscribe(
        () => {
          Swal.fire('تم تسجيل الاستبيان بنجاح', '', 'success').then(() => {
            this.router.navigate(['/company-dashboard/dash']);
          });
        },
        (err) => {
          this.errorHandler.handleError(err);
        }
      );
    }
  }
}
