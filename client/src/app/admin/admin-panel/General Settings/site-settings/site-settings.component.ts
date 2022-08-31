import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { SiteSettings } from 'src/app/admin/models/Site-Settings';
import { SiteSettingsService } from './site-settings.service';

@Component({
  selector: 'app-site-settings',
  templateUrl: './site-settings.component.html',
  styleUrls: ['./site-settings.component.css'],
})
export class SiteSettingsComponent implements OnInit {
  displayForm!: boolean;
  selected!: SiteSettings;
  siteSettings: SiteSettings[] = [];
  siteSettingForm: FormGroup;

  @ViewChild(FormGroupDirective) form: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private siteSettingsServ: SiteSettingsService
  ) {
    this.siteSettingForm = this.fb.group({
      value: [null, Validators.required],
      isVisible: [false],
    });
  }

  ngOnInit() {
    this.siteSettingsServ.getAll();
    this.siteSettingsServ.getUpdates().subscribe((data: SiteSettings[]) => {
      this.siteSettings = [...data];
    });
  }

  public get Key(): FormControl {
    return this.siteSettingForm.get('key') as FormControl;
  }

  public get Value(): FormControl {
    return this.siteSettingForm.get('value') as FormControl;
  }

  public get IsVisible(): FormControl {
    return this.siteSettingForm.get('isVisible') as FormControl;
  }

  showForm(selected: any = null) {
    this.displayForm = true;
    this.selected = selected;
    if (selected) {
      this.siteSettingForm.patchValue(selected);
    }
  }

  onSubmit() {
    let model = this.siteSettingForm.value;

    if (!this.selected && this.siteSettingForm.valid) {
      this.siteSettingsServ.add(model);
      this.displayForm = false;
    } else if (this.selected && this.siteSettingForm.valid) {
      model.key = this.selected.key;
      model.id = this.selected.id;
      this.siteSettingsServ.edit(this.selected.id, model);
      this.displayForm = false;
    }
  }

  onDelete(id: any) {
    this.siteSettingsServ.delete(id);
  }

  resetForm() {
    this.form.resetForm();
    this.selected = null;
    this.IsVisible.setValue(false);
  }
}
