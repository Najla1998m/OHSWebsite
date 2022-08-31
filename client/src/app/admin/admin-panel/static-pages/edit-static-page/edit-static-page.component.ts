import { AdminService } from 'src/app/admin/admin.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StaticPage } from 'src/app/admin/models/StaticPage';
import { StaticPageService } from '../static-page.service';

@Component({
  selector: 'app-edit-static-page',
  templateUrl: './edit-static-page.component.html',
  styleUrls: ['./edit-static-page.component.css'],
})
export class EditStaticPageComponent implements OnInit {
  form!: FormGroup;
  page!: StaticPage;
  uploadedFiles: string[] = [];
  editImg: boolean = true;
  constructor(
    private fb: FormBuilder,
    private pageServ: StaticPageService,
    private router: Router,
    private ar: ActivatedRoute,
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
      isVisible: [null, Validators.required],
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
  toHTML(input:string) : any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
}
  ngOnInit() {
    this.ar.params.subscribe((url) => {
      this.pageServ.getById(url.id).subscribe((resData) => {
        this.page = resData;
        this.form.patchValue(this.page);
        this.uploadedFiles.push(this.page.image);
      });
    });
  }

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

  async onEdit() {
    debugger;
    if (this.form.valid) {
      let obj: StaticPage = this.form.value;
      // obj.isDeleted = this.page.id;

      if (obj.image != this.page.image) {
        let imageBase64 = (await this.adminService.getImageInBase64(
          obj.image
        )) as string;

        obj.image = imageBase64.split(',')[1];
        obj.imageName = this.Image.value.name;
      }
      obj.id = this.page.id;
      this.pageServ.edit(this.page.id, obj);
    }
  }

  onUpload(event: any) {
    this.editImg = false;
    this.Image.setValue(event.files[0]);
  }

  onClear() {
    this.Image.reset();
  }
}
