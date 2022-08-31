import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { SubscriptionTypesService } from '../../Subscription-Types.service';

@Component({
  selector: 'app-attachment',
  templateUrl: './attachment.component.html',
  styleUrls: ['./attachment.component.css'],
})
export class AttachmentComponent implements OnInit {
  supscribtionId: any;
  attachList: any[] = [];
  formAttach: FormGroup;
  displayForm!: boolean;
  selected: any;
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  constructor(
    private attachService: SubscriptionTypesService,
    private ar: ActivatedRoute,
    private fb: FormBuilder,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.formAttach = this.fb.group({
      name: [null, Validators.required],
      isVisible: [false],
      isOptional: [false],
    });
    this.ar.params.subscribe((r) => {
      this.supscribtionId = r.id;
      this.attachService
        .getAttachmentBySupId(this.supscribtionId)
        .subscribe((res: any) => {
          this.attachList = res;
        });
    });
  }

  public get Name(): FormControl {
    return this.formAttach.get('name') as FormControl;
  }
  public get IsVisible(): FormControl {
    return this.formAttach.get('isVisible') as FormControl;
  }

  public get IsOptional(): FormControl {
    return this.formAttach.get('isOptional') as FormControl;
  }

  showForm(select: any) {
    this.displayForm = true;
    this.selected = select;
    console.log(this.selected);

    if (select) {
      this.formAttach.patchValue(this.selected);
    }
  }

  onDelete(id: number) {
    this.attachService.deleteAttach(id).subscribe((res) => {
      Swal.fire('Deleted!', '', 'success');
      this.attachService
        .getAttachmentBySupId(this.supscribtionId)
        .subscribe((res: any) => {
          this.attachList = res;

          console.log(this.attachList);
        });
    });
  }

  onSubmit() {
    let model = this.formAttach.value;
    model.subscriptionTypeId = this.supscribtionId;
    console.log(model);

    if (!this.selected && this.formAttach.valid) {
      this.attachService.addAttachment(model).subscribe((res) => {
        Swal.fire('Added!', '', 'success');
        this.attachService
          .getAttachmentBySupId(this.supscribtionId)
          .subscribe((res: any) => {
            this.attachList = res;
          });
      });

      this.displayForm = false;
      this.resetForm();
    } else {
      model.id = this.selected.id;
      console.log(model);

      this.attachService.editAttachment(model, this.selected.id).subscribe(
        (res) => {
          Swal.fire('updated', '', 'success');
          this.attachService
            .getAttachmentBySupId(this.supscribtionId)
            .subscribe((res: any) => {
              this.attachList = res;
            });
        },
        (errror: HttpErrorResponse) => {
          this.toast.error(errror.error);
        }
      );

      this.displayForm = false;
      this.resetForm();
    }
  }
  resetForm() {
    this.form.resetForm();
    this.selected = null;
  }
}
