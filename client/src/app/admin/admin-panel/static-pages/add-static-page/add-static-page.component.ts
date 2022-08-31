import { AdminService } from './../../../admin.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { StaticPageService } from '../static-page.service';

@Component({
  selector: 'app-add-static-page',
  templateUrl: './add-static-page.component.html',
  styleUrls: ['./add-static-page.component.css'],
})
export class AddStaticPageComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private pageServ: StaticPageService,
    private router: Router,
    private adminService: AdminService
  ) {
    this.form = this.fb.group({
      title: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      order: [null, [Validators.required, Validators.min(0)]],
      isVisible: [false, Validators.required],
      minDescription: [
        null,
        [
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(250),
        ],
      ],
      maxDescription: [null, [Validators.required]],
      image: [null, [Validators.required]],
    });
  }

  ngOnInit() {}

  public get Title(): FormControl {
    return this.form.get('title') as FormControl;
  }

  public get Order(): FormControl {
    return this.form.get('order') as FormControl;
  }

  public get IsVisible(): FormControl {
    return this.form.get('isVisible') as FormControl;
  }

  public get MinDescription(): FormControl {
    return this.form.get('minDescription') as FormControl;
  }

  public get MaxDescription(): FormControl {
    return this.form.get('maxDescription') as FormControl;
  }

  public get Image(): FormControl {
    return this.form.get('image') as FormControl;
  }

  onAdd() {
    if (this.form.valid) {
      let model = this.form.value;
      console.log(typeof model.maxDescription);

      this.adminService.getImageInBase64(model.image).then((data) => {
        model.image = data.split(',')[1];
        model.imageName = this.Image.value.name;

        this.pageServ.add(model);
      });
    }
  }

  onUpload(event: any) {
    this.Image.setValue(event.files[0]);
  }

  onClear() {
    this.Image.reset();
  }
}
