import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { RejectReason } from 'src/app/admin/models/Reject-reason';
import { RejectReasonsServiceService } from './RejectReasonsService.service';

@Component({
  selector: 'app-Signup-Reject-Reasons',
  templateUrl: './Signup-Reject-Reasons.component.html',
  styleUrls: ['./Signup-Reject-Reasons.component.css'],
})
export class SignupRejectReasonsComponent implements OnInit {
  Reasons: RejectReason[] = [];
  displayForm: boolean;
  reasonsForm!: FormGroup;
  selected: RejectReason;

  @ViewChild(FormGroupDirective) form: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private reasonServic: RejectReasonsServiceService
  ) {
    this.reasonsForm = this.fb.group({
      name: [null, [Validators.required]],
      // value: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.reasonServic.getAll();
    this.reasonServic.getUpdates().subscribe((res) => {
      this.Reasons = [...res];
      console.log(res);
    });
  }

  public get Name(): FormControl {
    return this.reasonsForm.get('name') as FormControl;
  }

  // public get Value(): FormControl {
  //   return this.reasonsForm.get('value') as FormControl;
  // }

  showForm(selected: RejectReason = null) {
    this.displayForm = true;
    this.selected = selected;
    if (selected) {
      // this.selected = selected;
      this.reasonsForm.patchValue(this.selected);
    }
  }

  onSubmit() {
    let model = this.reasonsForm.value;

    if (!this.selected && this.reasonsForm.valid) {
      this.reasonServic.add(model);
      this.displayForm = false;
      this.resetForm();
    } else if (this.selected && this.reasonsForm.valid) {
      model.id = this.selected.id;
      this.reasonServic.edit(this.selected.id, model);
      this.displayForm = false;
      this.resetForm();
    }
  }

  onDelete(id: number) {
    this.reasonServic.delete(id);
    // Swal.fire('Deleted!', '', 'success');
  }

  resetForm() {
    this.form.resetForm();
    this.selected = null;
  }
}
