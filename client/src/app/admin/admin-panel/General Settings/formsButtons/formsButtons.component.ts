import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Department } from 'src/app/admin/models/Department';
import { FormButton } from 'src/app/admin/models/formButton';
import { MainForm } from 'src/app/admin/models/MainForm';
import { FormButtonsService } from './formButtons.service';

@Component({
  selector: 'app-formsButtons',
  templateUrl: './formsButtons.component.html',
  styleUrls: ['./formsButtons.component.css'],
})
export class FormsButtonsComponent implements OnInit {
  listDepts: Department[] = [];
  formButons: FormGroup;
  listFormBtns: FormButton[] = [];
  parentForm: boolean = false;
  selected: any;
  MainForms: MainForm[];
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  constructor(
    private formsBtnService: FormButtonsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formButons = this.fb.group({
      value: [null, [Validators.required]],
      key: [null, [Validators.required]],
      isVisible: [false],
    });

    this.formsBtnService
      .GetAllDepartementsByCompanyId()
      .subscribe((res: any) => {
        this.listDepts = [...res];
      });

    this.loadMainForms();
    this.formsBtnService.getAllFormsBtns();
    this.formsBtnService.getUpdatesFormBtns().subscribe((res: any) => {
      this.listFormBtns = [...res];
    });
  }

  public get Value(): FormControl {
    return this.formButons.get('value') as FormControl;
  }

  public get Key(): FormControl {
    return this.formButons.get('key') as FormControl;
  }

  openEdit(input: any) {
    this.selected = input;
    console.log(this.selected);

    this.formButons.patchValue(this.selected);
    this.Value.patchValue(+this.selected.value);
  }

  onSubmit() {
    if (this.formButons.valid) {
      let model = this.formButons.value;
      if (!this.selected) {
        if (this.parentForm) {
          model.settingType = 'FormButtonWithChilds';
        } else {
          model.settingType = 'FormButton';
        }

        this.formsBtnService.CreateSetting(model);
      } else if (this.selected) {
        if (this.parentForm) {
          model.settingType = 'FormButtonWithChilds';
        } else {
          model.settingType = 'FormButton';
        }
        model.id = this.selected.id;
        console.log(model);
        this.formsBtnService.updateSetting(this.selected.id, model);
        this.parentForm = false;
      }

      this.form.resetForm();
      this.selected = null;
    }
  }

  loadMainForms() {
    this.formsBtnService.GetAllForms().subscribe((data: any) => {
      this.MainForms = [...data];
    });
  }

  delete(id: number) {
    this.formsBtnService.delete(id);
  }
}
