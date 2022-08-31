import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormFileType } from 'src/app/admin/models/formFileType';
import { validatorsFiledType } from 'src/app/admin/models/ValidatorsFormType';
import { FormFiledTypeService } from './formFiledType.service';

@Component({
  selector: 'app-Form-Field-Types',
  templateUrl: './Form-Field-Types.component.html',
  styleUrls: ['./Form-Field-Types.component.css'],
})
export class FormFieldTypesComponent implements OnInit {
  listFormFiledTypes: FormFileType[] = [];
  listValidators: validatorsFiledType[] = [];
  displayForm: boolean = false;
  typeFiledForm: FormGroup;
  selected: FormFileType;
  Roless: any[];
  constructor(
    private FiledTypService: FormFiledTypeService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.FiledTypService.getAllFormsTypes();
    this.FiledTypService.getUpdates().subscribe((res: any) => {
      this.listFormFiledTypes = [...res];
    });

    this.FiledTypService.getAllValidators().subscribe((res: any) => {
      this.listValidators = [...res];
      console.log(this.listValidators);
    });
    this.typeFiledForm = this.fb.group({
      name: [null, [Validators.required]],
      defaultValue: [null],
      roles: [null],
    });
  }

  public get Name(): FormControl {
    return this.typeFiledForm.get('name') as FormControl;
  }

  public get DefaultValue(): FormControl {
    return this.typeFiledForm.get('defaultValue') as FormControl;
  }

  public get Roles(): FormControl {
    return this.typeFiledForm.get('roles') as FormControl;
  }

  showForm(selected: any) {
    this.displayForm = true;
    this.selected = selected;
    this.Roless = this.selected.roles.split(',');
    this.selected = selected;

    if (selected) {
      this.typeFiledForm.patchValue(selected);
      this.Roles.patchValue(this.Roless);
    }
  }

  onSubmit() {
    let model = this.typeFiledForm.value;

    if (!this.selected && this.typeFiledForm.valid) {
      console.log(model);
      model.roles = model.roles.toString();
      this.FiledTypService.createFormFiledType(model);
    } else if (this.selected && this.typeFiledForm.valid) {
      model.id = this.selected.id;
      console.log(model);
      model.roles = model.roles.toString();
      this.FiledTypService.UpdeteFormFiledType(model);
    }

    this.displayForm = false;
  }

  onDelete(id: any) {
    this.FiledTypService.deleteFormFieldType(id);
  }
  resetForm() {
    this.selected = null;
    this.displayForm = false;
  }
}
