import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Category } from 'src/app/admin/models/category';
import { CategoriesService } from '../category/Categories.service';
import { SubCategoryService } from './sub-category.service';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.css'],
})
export class SubCategoryComponent implements OnInit {
  categoriesList!: Category[];
  subCategories!: Category[];
  categoryForm!: FormGroup;
  displayForm!: boolean;
  selected!: Category;
  category: Category = null;

  @ViewChild(FormGroupDirective) form: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private categoryServ: SubCategoryService,
    private mainCatServ: CategoriesService
  ) {
    this.categoryForm = this.fb.group({
      name: [null, Validators.required],
      isVisible: [false],
      forContact: [false],
      forOrders: [false],
      parentId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.mainCatServ.getAll();
    this.mainCatServ.getUpdates().subscribe((data: any) => {
      this.categoriesList = [...data];
      this.subCategories = data.filter((c: Category) => c.parentID != null);

      console.log(this.subCategories);
    });
  }

  public get Name(): FormControl {
    return this.categoryForm.get('name') as FormControl;
  }

  public get ForOrders(): FormControl {
    return this.categoryForm.get('forOrders') as FormControl;
  }

  public get IsVisible(): FormControl {
    return this.categoryForm.get('isVisible') as FormControl;
  }

  public get ForContact(): FormControl {
    return this.categoryForm.get('forContact') as FormControl;
  }

  public get ParentId(): FormControl {
    return this.categoryForm.get('parentId') as FormControl;
  }

  showForm(selected: Category = null) {
    this.displayForm = true;
    this.selected = selected;
    if (selected) {
      this.categoryForm.patchValue(this.selected);
      this.ParentId.patchValue(this.getMainCategory(this.selected));
    }
  }

  onSubmit() {
    let model = this.categoryForm.value;

    model.departementId = this.ParentId.value.departementId;
    model.forContact = this.ForContact ? this.ForContact.value : false;
    model.forOrders = this.ForOrders ? this.ForOrders.value : false;
    model.isVisible = this.IsVisible ? this.IsVisible.value : false;
    model.parentID = this.ParentId.value.id;
    model.parentId = null;

    if (!this.selected && this.categoryForm.valid) {
      console.log(model);

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
    this.category = null;
  }

  onDelete(id: number) {
    this.categoryServ.delete(id);
  }

  getMainCategory(cat: any) {
    return this.categoriesList.find((c) => c.id == cat.parentID);
  }
}
