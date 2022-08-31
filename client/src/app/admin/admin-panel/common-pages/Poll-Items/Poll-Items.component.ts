import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { PollService } from './Poll.service';

@Component({
  selector: 'app-Poll-Items',
  templateUrl: './Poll-Items.component.html',
  styleUrls: ['./Poll-Items.component.css'],
})
export class PollItemsComponent implements OnInit {
  listPollItem: any[] = [];
  displayForm!: boolean;
  selected: any;
  pollForm: FormGroup;
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  constructor(private pollService: PollService, private fb: FormBuilder) {}

  ngOnInit() {
    this.pollService.getPollItems();
    this.pollService.getUpdates().subscribe((res: any) => {
      this.listPollItem = [...res];
    });

    this.pollForm = this.fb.group({
      name: [null, Validators.required],
      isVisible: [false, []],
    });
  }

  public get Name(): FormControl {
    return this.pollForm.get('name') as FormControl;
  }

  public get IsVisible(): FormControl {
    return this.pollForm.get('isVisible') as FormControl;
  }

  showForm(selected: any = null) {
    this.displayForm = true;
    if (selected) {
      this.selected = selected;
      this.pollForm.patchValue(selected);
    }
  }

  onDelete(id: any) {
    this.pollService.deletePollItem(id);
  }
  onSubmit() {
    let model = this.pollForm.value;
    console.log(model);
    if (!this.selected && this.pollForm.valid) {
      this.pollService.addPollItem(model);
    } else if (this.selected && this.pollForm.valid) {
      model.id = this.selected?.id;
      this.pollService.editPollItem(model);
    }
    this.displayForm = false;
  }
  resetForm() {
    this.form.resetForm();
    this.selected = null;

    this.pollForm.get('isVisible').setValue(false);
    this.displayForm = false;
  }
}
