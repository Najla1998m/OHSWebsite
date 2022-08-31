import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Category } from 'src/app/admin/models/category';
import { Department } from 'src/app/admin/models/Department';
import { DepartmentService } from '../department/department.service';
import { CategoriesService } from './Categories.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  categoriesList!: Category[];
  categoryForm!: FormGroup;
  displayForm!: boolean;
  selected!: Category;
  departments!: Department[];
  department: Department = null;

  @ViewChild(FormGroupDirective) form: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private categoryServ: CategoriesService,
    private deptServ: DepartmentService
  ) {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      isVisible: [false, []],
      forContact: [false, []],
      forOrders: [false, []],
    });
  }

  ngOnInit() {
    this.categoryServ.getAll();
    this.categoryServ.getUpdates().subscribe((data) => {
      this.categoriesList = [...data].filter(
        (c: Category) => c.parentID == null
      );
    });

    this.deptServ.getAll();
    this.deptServ.getUpdates().subscribe((data) => {
      this.departments = [...data];
    });
  }

  public get Name(): FormControl {
    return this.categoryForm.get('name') as FormControl;
  }

  showForm(selected: Category = null) {
    this.displayForm = true;
    this.selected = selected;
    if (selected) {
      this.categoryForm.patchValue(this.selected);
      this.department = selected.departement;
    }
  }

  onSubmit() {
    let model = this.categoryForm.value;

    model.departement = this.department;
    if (this.department) model.departementId = this.department.id;

    if (!this.selected && this.categoryForm.valid) {
      let model = this.categoryForm.value;
      this.categoryServ.add(model);
      this.displayForm = false;
    } else if (this.selected && this.categoryForm.valid) {
      model.id = this.selected.id;
      this.categoryServ.edit(this.selected.id, model);
      this.displayForm = false;
    }
  }

  resetForm() {
    this.form.resetForm();
    this.selected = null;
    this.department = null;
    this.categoryForm.get('isVisible').setValue(false);
    this.categoryForm.get('forContact').setValue(false);
    this.categoryForm.get('forOrders').setValue(false);
  }

  onDelete(id: number) {
    this.categoryServ.delete(id);
  }

  show() {
    console.log(this.department);
  }
}
