import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AttachCompanyService } from '../../../new-Company-Admins/companyAttachments/attachCompany.service';

@Component({
  selector: 'app-VendorMangerAttachments',
  templateUrl: './VendorMangerAttachments.component.html',
  styleUrls: ['./VendorMangerAttachments.component.css'],
})
export class VendorMangerAttachmentsComponent implements OnInit {
  listAttach: any[] = [];
  listRejects: any[] = [];
  displayReject: boolean = false;

  rejectForm: FormGroup;
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  userId: any;
  taskId: any;
  constructor(
    private attachService: AttachCompanyService,
    private ar: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.ar.params.subscribe((res: any) => {
      this.userId = res.id;

      this.attachService.getAttachments(this.userId);
      this.attachService.getUpdates().subscribe((res: any) => {
        this.listAttach = res.attachments;
        this.taskId = res.id;

        console.log(this.listAttach, 'list');
      });
    });

    this.attachService.getRejectReasons().subscribe((res: any) => {
      this.listRejects = [...res];
    });

    this.rejectForm = this.fb.group({
      rejectReason: [null, [Validators.required]],
      subscriptionTypeAttachmentList: [[], Validators.required],
    });
  }

  public get RejectReason(): FormControl {
    return this.rejectForm.get('rejectReason') as FormControl;
  }
  public get Attach(): FormControl {
    return this.rejectForm.get('subscriptionTypeAttachmentList') as FormControl;
  }

  showReject() {
    this.displayReject = !this.displayReject;
  }
  showAccept() {
    let isActive = true;
    this.attachService.acceptUser(this.userId, isActive);
  }

  rejectAttach() {
    let model = this.rejectForm.value;
    model.taskId = this.taskId;
    console.log(model);
    this.attachService.RejectAttachments(model);
    this.resetForm();
  }

  resetForm() {
    this.form.resetForm();
    this.displayReject = false;
  }
}
