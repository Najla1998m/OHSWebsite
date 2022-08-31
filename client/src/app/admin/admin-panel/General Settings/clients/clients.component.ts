import { AdminService } from 'src/app/admin/admin.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Client } from 'src/app/admin/models/Client';
import { ClientsService } from './clients.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit {
  displayForm!: boolean;
  selected!: Client;
  clients: Client[] = [];
  clientForm: FormGroup;

  @ViewChild(FormGroupDirective) form: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private clientServ: ClientsService,
    private adminService: AdminService
  ) {
    this.clientForm = this.fb.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      image: [null, Validators.required],
      order: [null, [Validators.required, Validators.min(0)]],
      isVisible: [false],
    });
  }

  ngOnInit() {
    this.clientServ.getAll();
    this.clientServ.getUpdates().subscribe((data: Client[]) => {
      this.clients = [...data];
    });
  }

  public get Name(): FormControl {
    return this.clientForm.get('name') as FormControl;
  }

  public get Image(): FormControl {
    return this.clientForm.get('image') as FormControl;
  }

  public get Order(): FormControl {
    return this.clientForm.get('order') as FormControl;
  }

  public get IsVisible(): FormControl {
    return this.clientForm.get('isVisible') as FormControl;
  }

  showForm(selected: any = null) {
    this.displayForm = true;
    this.selected = selected;
    if (selected) {
      this.clientForm.patchValue(selected);
    }
  }

  onUpload(event: any) {
    this.Image.setValue(event.files[0]);
  }

  onClear() {
    this.Image.reset();
  }

  async onSubmit() {
    if (!this.clientForm.valid) return;

    let model = this.clientForm.value;

    if (!this.selected) {
      let imageBase64 = (await this.adminService.getImageInBase64(
        model.image
      )) as string;

      model.image = imageBase64.split(',')[1];
      model.imageName = this.Image.value.name;

      this.clientServ.add(model);
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

    this.clientServ.edit(this.selected.id, model);
    this.displayForm = false;
  }

  onDelete(id: any) {
    this.clientServ.delete(id);
  }

  createImageUrl(img: any) {
    // return URL.createObjectURL(img);
  }

  resetForm() {
    this.form.resetForm();
    this.selected = null;
    this.onClear();
  }
}
