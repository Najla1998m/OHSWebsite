import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Package } from 'src/app/admin/models/Package';
import { PackagesService } from './packages.service';

@Component({
  selector: 'app-Packages',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.css'],
})
export class PackagesComponent implements OnInit {
  displayForm!: boolean;
  displayFormDetails!: boolean;
  selected!: Package;
  packages: Package[] = [];
  packageForm: FormGroup;

  @ViewChild(FormGroupDirective) form: FormGroupDirective;

  constructor(private fb: FormBuilder, private packagesServ: PackagesService) {
    this.packageForm = this.fb.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      symbol: [null, [Validators.required]],
      isVisible: [false],
      forVendors: [false],
      forClients: [false],
      employeesNumbers: [null, [Validators.required, Validators.min(1)]],
      duration: [null, [Validators.required]],
      allowedDays: [null, [Validators.required]],
      pricePerEmployee: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.packagesServ.getAll();
    this.packagesServ.getUpdates().subscribe((data: any) => {
      this.packages = [...data];
      console.log(data);
    });
  }

  public get Name(): FormControl {
    return this.packageForm.get('name') as FormControl;
  }

  public get Symbol(): FormControl {
    return this.packageForm.get('symbol') as FormControl;
  }

  public get IsVisible(): FormControl {
    return this.packageForm.get('isVisible') as FormControl;
  }

  public get forVendors(): FormControl {
    return this.packageForm.get('forVendors') as FormControl;
  }

  public get forClients(): FormControl {
    return this.packageForm.get('forClients') as FormControl;
  }

  public get EmployeesNumbers(): FormControl {
    return this.packageForm.get('employeesNumbers') as FormControl;
  }

  public get Duration(): FormControl {
    return this.packageForm.get('duration') as FormControl;
  }

  public get AllowedDays(): FormControl {
    return this.packageForm.get('allowedDays') as FormControl;
  }

  public get PricePerEmployee(): FormControl {
    return this.packageForm.get('pricePerEmployee') as FormControl;
  }

  showForm(selected: any = null) {
    this.displayForm = true;
    this.selected = selected;
    if (selected) {
      this.packageForm.patchValue(selected);
    }
  }

  onSubmit() {
    if (!this.selected && this.packageForm.valid) {
      let model = this.packageForm.value;
      this.packagesServ.add(model);
      this.displayForm = false;
    } else if (this.selected && this.packageForm.valid) {
      let model = this.packageForm.value;
      this.packagesServ.edit(this.selected.id, model);
      this.displayForm = false;
    }
  }

  onDelete(id: any) {
    this.packagesServ.delete(id);
  }

  resetForm() {
    this.form.resetForm();
    this.selected = null;
  }

  onDetails(id: number) {
    this.displayFormDetails = true;
  }
}
