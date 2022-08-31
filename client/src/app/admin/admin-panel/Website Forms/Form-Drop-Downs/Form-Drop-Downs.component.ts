import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { DropDownForm } from 'src/app/admin/models/DropDownForm';
import { FormDropDownService } from './formDropDown.service';

@Component({
  selector: 'app-Form-Drop-Downs',
  templateUrl: './Form-Drop-Downs.component.html',
  styleUrls: ['./Form-Drop-Downs.component.css'],
})
export class FormDropDownsComponent implements OnInit {
  AllForms: FormGroup;
  dropDownForm: FormGroup;
  listAllForms: any[] = [];
  listDropForms: DropDownForm[] = [];
  displayForm: boolean = false;
  selected: DropDownForm;
  @ViewChild(FormGroupDirective) form2: FormGroupDirective;
  constructor(
    private dropFormService: FormDropDownService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.AllForms = this.fb.group({
      id: [null],
    });

    this.dropDownForm = this.fb.group({
      name: [null, [Validators.required]],
      displayNameAr: [null, [Validators.required]],
      displayNameEn: [null, [Validators.required]],
      defaultValue: [null],
    });
    this.dropFormService.getAllForms();
    this.dropFormService.getUpdatesAllForms().subscribe((res) => {
      this.listAllForms = [...res];
    });

    this.dropFormService.GetAllFormOptionSet();
    this.dropFormService.getUpdatesAllDropForm().subscribe((res) => {
      this.listDropForms = [...res];
      console.log(this.listDropForms);
    });
  }

  public get Id(): FormControl {
    return this.AllForms.get('id') as FormControl;
  }

  public get Name(): FormControl {
    return this.dropDownForm.get('name') as FormControl;
  }
  public get NameAr(): FormControl {
    return this.dropDownForm.get('displayNameAr') as FormControl;
  }
  public get NameEn(): FormControl {
    return this.dropDownForm.get('displayNameEn') as FormControl;
  }

  public get DefaultValue(): FormControl {
    return this.dropDownForm.get('defaultValue') as FormControl;
  }
  showForm(selected: DropDownForm) {
    this.displayForm = true;
    this.selected = selected;
    if (selected) {
      console.log(selected);
      this.dropDownForm.patchValue(selected);
    }
  }

  onSubmit() {
    if (!this.selected && this.dropDownForm.value) {
      let model = this.dropDownForm.value;
      debugger;
      console.log(model);
      this.dropFormService.addDropDownForm(model);
    } else if (this.selected && this.dropDownForm.value) {
      let editModel = this.dropDownForm.value;
      debugger;
      editModel.id = this.selected.id;
      this.dropFormService.updateDropDownForm(editModel);
    }
    this.displayForm = false;
  }

  onDelete(id: any) {
    this.dropFormService.deleteDropdown(id);
  }
  resetForm() {
    this.selected = null;
    this.form2.resetForm();
  }
}
