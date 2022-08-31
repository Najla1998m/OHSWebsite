import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormOptionSetItem } from 'src/app/admin/models/formOptionSetItem';
import { FormDropDownService } from '../formDropDown.service';

@Component({
  selector: 'app-OptionsSetItem',
  templateUrl: './OptionsSetItem.component.html',
  styleUrls: ['./OptionsSetItem.component.css'],
})
export class OptionsSetItemComponent implements OnInit {
  listOptions: FormOptionSetItem[] = [];
  id: any;
  displayForm: boolean = false;
  optionForm: FormGroup;
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  constructor(
    private formdropService: FormDropDownService,
    private ar: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.ar.params.subscribe((res) => {
      this.id = res.id;
    });

    this.formdropService.allOptionByFormId(this.id);
    this.formdropService.getUpdateOptions().subscribe((res: any) => {
      this.listOptions = [...res];
      console.log(this.listOptions);
    });

    this.optionForm = this.fb.group({
      name: [null, [Validators.required]],
      valueAR: [null, [Validators.required]],
      valueEN: [null, [Validators.required]],
    });
  }

  public get Name(): FormControl {
    return this.optionForm.get('name') as FormControl;
  }

  public get ValueAR(): FormControl {
    return this.optionForm.get('valueAR') as FormControl;
  }

  public get ValueEN(): FormControl {
    return this.optionForm.get('valueEN') as FormControl;
  }
  showForm() {
    this.displayForm = true;
  }

  resetForm() {
    this.displayForm = false;
    this.form.resetForm();
  }

  onSubmit() {
    let model = this.optionForm.value;
    model.formOptionSetId = this.id;
    console.log(model);
    this.formdropService.creatOptionItem(model);
    this.displayForm = false;
  }

  onDelete(id: number) {
    this.formdropService.deleteOptionItem(id);
  }
}
