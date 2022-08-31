import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { StaticSlideService } from './static-slide.service';

@Component({
  selector: 'app-static-slider-block',
  templateUrl: './static-slider-block.component.html',
  styleUrls: ['./static-slider-block.component.css'],
})
export class StaticSliderBlockComponent implements OnInit {
  Slides!: any[];
  selectedSlide!: any;

  @ViewChild('openModal', { static: false }) modalButton: ElementRef;
  @ViewChild(FormGroupDirective) form: FormGroupDirective;

  editForm: FormGroup;

  constructor(
    private sliderServices: StaticSlideService,
    private fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      title: [null, Validators.required],
      image: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.sliderServices.getSlides();
    this.sliderServices.getUpdates().subscribe((data) => {
      this.Slides = [...data];
    });
  }

  public get Title(): FormControl {
    return this.editForm.get('title') as FormControl;
  }

  public get Image(): FormControl {
    return this.editForm.get('image') as FormControl;
  }

  openForm(slide: any) {
    this.selectedSlide = slide;
    console.log(slide);

    this.editForm.patchValue(this.selectedSlide);
    this.modalButton.nativeElement.click();
  }

  onUpload(event: any) {
    this.Image.setValue(event.files[0]);
  }

  onClear() {
    this.Image.reset();
  }

  onSubmit() {
    let model = this.editForm.value;
    model.image = this.createImageUrl(model.image);
    this.sliderServices.edit(this.selectedSlide.id, model);
    this.resetForm();
    this.modalButton.nativeElement.click();
  }

  resetForm() {
    this.form.resetForm();
    this.selectedSlide = null;
    this.onClear();
  }

  createImageUrl(img: any) {
    return URL.createObjectURL(img);
  }
}
