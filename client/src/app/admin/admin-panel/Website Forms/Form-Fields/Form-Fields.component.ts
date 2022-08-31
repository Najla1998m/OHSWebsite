import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DropDownForm } from 'src/app/admin/models/DropDownForm';
import { FormFields } from 'src/app/admin/models/formFields';
import { FormFileType } from 'src/app/admin/models/formFileType';
import { MainForm } from 'src/app/admin/models/MainForm';
import { FormDropDownService } from '../Form-Drop-Downs/formDropDown.service';
import { FormFiledTypeService } from '../Form-Field-Types/formFiledType.service';
import { MainFormServiceService } from '../Main-Forms/mainFormService.service';
import { FormFieldsService } from './formFields.service';

@Component({
  selector: 'app-Form-Fields',
  templateUrl: './Form-Fields.component.html',
  styleUrls: ['./Form-Fields.component.css'],
})
export class FormFieldsComponent implements OnInit {
  listFields: FormFields[] = [];
  listForms: MainForm[] = [];
  listFieldTypes: FormFileType[] = [];
  listOptions: DropDownForm[] = [];
  selected: FormFields;
  displayForm: boolean = false;
  displayDropdown: boolean = false;
  displayMainForm: boolean = false;
  fieldForm: FormGroup;
  constructor(
    private FormFieldService: FormFieldsService,
    private filedTypeService: FormFiledTypeService,
    private formDropService: FormDropDownService,
    private mainFormServic: MainFormServiceService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.FormFieldService.getAllFormFields();
    this.FormFieldService.getUpdates().subscribe((res: any) => {
      this.listFields = [...res];
    });

    this.filedTypeService.getAllFormsTypes();
    this.filedTypeService.getUpdates().subscribe((res: any) => {
      this.listFieldTypes = [...res];
    });

    this.fieldForm = this.fb.group({
      name: [null, [Validators.required]],
      displayNameAr: [null, [Validators.required]],
      displayNameEn: [null, [Validators.required]],
      defaultValue: [null],
      formOptionSetId: [null],
      formItemTypeId: [null],
      formId: [null],
      value: ['1'],
    });
  }

  load(event: any) {
    let drop = this.listFieldTypes.filter((r) => r.id == event);

    if (drop[0].defaultValue === 'Select') {
      this.displayDropdown = true;
      this.displayMainForm = true;
    } else {
      this.displayDropdown = false;
      this.displayMainForm = true;
    }

    this.formDropService.GetAllFormOptionSet();
    this.formDropService.getUpdatesAllDropForm().subscribe((res: any) => {
      this.listOptions = [...res];
    });

    this.mainFormServic.getAllMainForm();
    this.mainFormServic.getUpdates().subscribe((res: any) => {
      this.listForms = [...res];
    });
  }

  public get Name(): FormControl {
    return this.fieldForm.get('name') as FormControl;
  }

  public get NameAr(): FormControl {
    return this.fieldForm.get('displayNameAr') as FormControl;
  }
  public get NameEn(): FormControl {
    return this.fieldForm.get('displayNameEn') as FormControl;
  }

  public get DefaultValue(): FormControl {
    return this.fieldForm.get('defaultValue') as FormControl;
  }

  showForm(selected: FormFields) {
    this.selected = selected;
    this.displayForm = true;
    if (selected) {
      this.fieldForm.patchValue(selected);
    }
  }
  onSubmit() {
    let model = this.fieldForm.value;
    console.log(model);
    if (!this.selected && this.fieldForm.value) {
      this.FormFieldService.createFormField(model);
    } else if (this.selected && this.fieldForm.value) {
      model.id = this.selected.id;
      console.log(model);

      this.FormFieldService.updateFormField(model);
    }

    this.displayForm = false;
  }

  onDelete(id: any) {
    this.FormFieldService.deleteFormField(id);
  }
  resetForm() {
    this.selected = null;
    this.displayForm = false;
  }
}
