import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  MaxValidator,
  Validators,
} from '@angular/forms';
import { Department } from 'src/app/admin/models/Department';
import { MainForm } from 'src/app/admin/models/MainForm';
import Swal from 'sweetalert2';
import { MainFormServiceService } from './mainFormService.service';

@Component({
  selector: 'app-Main-Forms',
  templateUrl: './Main-Forms.component.html',
  styleUrls: ['./Main-Forms.component.css'],
})
export class MainFormsComponent implements OnInit {
  listMainForm: MainForm[] = [];
  displayForm: boolean = false;
  listDepts: Department[] = [];
  selected: MainForm;
  mainForm: FormGroup;
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  constructor(
    private mainFormService: MainFormServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.mainFormService.getAllMainForm();
    this.mainFormService
      .getUpdates()
      .subscribe((res) => [(this.listMainForm = [...res])]);

    this.mainFormService
      .GetAllDepartementsByCompanyId()
      .subscribe((res: any) => {
        this.listDepts = [...res];
      });
    this.mainForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern('[a-zA-Z0-9]+')]],
      displayNameAr: [null, [Validators.required]],
      displayNameEn: [null, [Validators.required]],
      DepartementId: [null, [Validators.required]],
    });
  }

  public get Name(): FormControl {
    return this.mainForm.get('name') as FormControl;
  }
  public get NameAr(): FormControl {
    return this.mainForm.get('displayNameAr') as FormControl;
  }
  public get NameEn(): FormControl {
    return this.mainForm.get('displayNameEn') as FormControl;
  }

  showForm(selected: MainForm) {
    this.displayForm = true;
    this.selected = selected;
    if (selected) {
      console.log(selected);
      this.mainForm.get('DepartementId').setValue(selected.DepartementId);
      this.mainForm.patchValue(selected);
    }
  }

  delete(form: MainForm) {
    this.mainFormService.DeleteFormById(form);
  }

  onSubmit() {
    if (this.mainForm.valid) {
      if (!this.selected && this.mainForm.value) {
        let model = this.mainForm.value;

        console.log(model);
        this.mainFormService.createMainForm(model);
      } else if (this.selected && this.mainForm.value) {
        let editModel = this.mainForm.value;

        editModel.id = this.selected.id;
        this.mainFormService.updateMainForm(editModel);
      }
      this.displayForm = false;
    }
  }
  resetForm() {
    this.selected = null;
    this.form.resetForm();
  }
}
