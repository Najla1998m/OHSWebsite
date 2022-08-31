import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { AdminService } from 'src/app/admin/admin.service';
import { Product } from 'src/app/admin/models/product';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[];
  productForm!: FormGroup;
  displayForm!: boolean;
  selected!: Product;

  @ViewChild(FormGroupDirective) form: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private productServ: ProductsService,
    private adminService: AdminService
  ) {
    this.productForm = this.fb.group({
      name: [null, Validators.required],
      image: [null, Validators.required],
      type: [null, Validators.required],
      isVisible: [null],
    });
  }

  ngOnInit() {
    this.productServ.getAll();
    this.productServ.getUpdates().subscribe((data) => {
      this.products = [...data];
    });
  }

  public get Name(): FormControl {
    return this.productForm.get('name') as FormControl;
  }

  public get Image(): FormControl {
    return this.productForm.get('image') as FormControl;
  }

  public get Type(): FormControl {
    return this.productForm.get('type') as FormControl;
  }

  public get IsVisible(): FormControl {
    return this.productForm.get('isVisible') as FormControl;
  }

  showForm(selected: Product = null) {
    this.displayForm = true;
    this.selected = selected;
    if (selected) {
      this.productForm.patchValue(this.selected);
    }
  }

  onUpload(event: any) {
    this.Image.setValue(event.files[0]);
  }

  onClear() {
    this.Image.reset();
  }

  async onSubmit() {
    if (!this.productForm.valid) return;

    let model: Product = this.productForm.value;

    if (!this.selected) {
      let imageBase64 = (await this.adminService.getImageInBase64(
        model.image
      )) as string;

      model.image = imageBase64.split(',')[1];
      model.imageName = this.Image.value.name;

      this.productServ.add(model);
      this.displayForm = false;
      return;
    }

    if (model.image != this.selected.image) {
      let imageBase64 = (await this.adminService.getImageInBase64(
        model.image
      )) as string;

      model.image = imageBase64.split(',')[1];
      model.imageName = this.Image.value.name;
    }

    model.id = this.selected.id;
    this.productServ.edit(this.selected.id, model);
    this.displayForm = false;
  }

  onDelete(id: any) {
    this.productServ.delete(id);
  }

  resetForm() {
    this.form.resetForm();
    this.selected = null;
    this.onClear();
  }

  createImageUrl(img: any) {
    return URL.createObjectURL(img);
  }
}
