import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { AdminService } from 'src/app/admin/admin.service';
import { ImageSlider } from 'src/app/admin/models/ImageSlider';
import Swal from 'sweetalert2';
import { SliderService } from './Slider.service';

@Component({
  selector: 'app-Slider',
  templateUrl: './Slider.component.html',
  styleUrls: ['./Slider.component.css'],
})
export class SliderComponent implements OnInit {
  displayForm!: boolean;
  editImg: boolean = true;
  sliderArray: ImageSlider[];
  selected!: ImageSlider;
  sliderForm!: FormGroup;

  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  @ViewChild('image') image: ElementRef;

  constructor(
    private sliderServ: SliderService,
    private fb: FormBuilder,
    private adminService: AdminService
  ) {
    this.sliderForm = this.fb.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      image: [null, [Validators.required]],
      altHeadline: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      altBody: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(250),
        ],
      ],
      url: [],
      isVisible: [false],
      isDeleted: [],
    });
  }

  ngOnInit() {
    this.sliderServ.getAll();
    this.sliderServ.getUpdates().subscribe((data) => {
      this.sliderArray = [...data];
    });
  }

  public get Name(): FormControl {
    return this.sliderForm.get('name') as FormControl;
  }

  public get Image(): FormControl {
    return this.sliderForm.get('image') as FormControl;
  }

  public get AltHeadline(): FormControl {
    return this.sliderForm.get('altHeadline') as FormControl;
  }

  public get AltBody(): FormControl {
    return this.sliderForm.get('altBody') as FormControl;
  }

  public get Url(): FormControl {
    return this.sliderForm.get('url') as FormControl;
  }

  public get IsVisible(): FormControl {
    return this.sliderForm.get('isVisible') as FormControl;
  }

  public get IsDeleted(): FormControl {
    return this.sliderForm.get('isDeleted') as FormControl;
  }

  showForm(selected: ImageSlider = null) {
    this.displayForm = true;
    this.selected = selected;
    if (selected) {
      this.sliderForm.patchValue(this.selected);
    }
  }

  onUpload(event: any) {
    console.log(this.image);
    this.Image.setValue(event.files[0]);
    this.editImg = false;
  }

  onClear() {
    this.Image.reset();
  }

  async onSubmit() {
    if (!this.sliderForm.valid) return;

    let model = this.sliderForm.value;

    if (!this.selected) {
      let imageBase64 = (await this.adminService.getImageInBase64(
        model.image
      )) as string;

      model.image = imageBase64.split(',')[1];
      model.imageName = this.Image.value.name;

      this.sliderServ.add(model);
      this.displayForm = false;
      return;
      // Swal.fire('Added!', '', 'success');
    }

    if (model.image != this.selected.image) {
      let imageBase64 = (await this.adminService.getImageInBase64(
        model.image
      )) as string;

      model.image = imageBase64.split(',')[1];
      model.imageName = this.Image.value.name;
    }

    this.sliderServ.edit(this.selected.id, model);
    this.displayForm = false;
    // Swal.fire('Updated!', '', 'success');
  }

  onDelete(id: any) {
    this.sliderServ.delete(id);
    // Swal.fire('Deleted!', '', 'success');
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
