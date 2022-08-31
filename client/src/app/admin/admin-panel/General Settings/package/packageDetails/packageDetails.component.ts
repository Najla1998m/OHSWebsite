import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { arLocale, defineLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { PackageDetails } from 'src/app/admin/models/packageDetails';
import { LangService } from 'src/app/shared/services/lang.service';
import Swal from 'sweetalert2';
import { PackagesService } from '../packages.service';

@Component({
  selector: 'app-packageDetails',
  templateUrl: './packageDetails.component.html',
  styleUrls: ['./packageDetails.component.css'],
})
export class PackageDetailsComponent implements OnInit {
  packageId: number;
  displayForm: boolean = false;
  packageForm: FormGroup;
  packageDetails: PackageDetails[] = [];
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  listCritaria: any[] = [];
  selected!: any;
  selectedd!: any;
  colorTheme = 'theme-default';
  bsConfig!: Partial<BsDatepickerConfig>;
  minDate!: any;
  maxDate!: any;
  constructor(
    private packageService: PackagesService,
    private ar: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private lang: LangService,
    private localeService: BsLocaleService
  ) {}

  ngOnInit() {
    this.ar.params.subscribe((r) => {
      this.packageId = r.id;
      this.packageService.getPackageDetails(this.packageId);
      this.packageService.getDetailsUpdates().subscribe((res) => {
        this.packageDetails = [...res];
      });
    });

    defineLocale('ar', arLocale);
    defineLocale('en', enGbLocale);

    this.lang.getCurrentLang() == 'ar'
      ? this.localeService.use('ar')
      : this.localeService.use('en');
    // listen to the current language
    this.lang.getIsLangArHandler().subscribe((isLangAr) => {
      if (isLangAr) {
        this.localeService.use('ar');
      } else {
        this.localeService.use('en');
      }
    });

    this.packageService.getCritaria().subscribe((res: any) => {
      this.listCritaria = res;
      console.log(res);
    });

    this.packageForm = this.fb.group({
      crite: [null, [Validators.required]],
      value: [null, [Validators.required]],
    });
  }

  get Crite(): FormControl {
    return this.packageForm.get('crite') as FormControl;
  }

  get Value(): FormControl {
    return this.packageForm.get('value') as FormControl;
  }

  showForm(input: PackageDetails = null) {
    this.displayForm = true;
    this.selectedd = input;
    if (this.selectedd) {
      this.selected = this.listCritaria.find(
        (e) => e.name == this.selectedd.name
      );

      this.Crite.setValue(this.selected);
      console.log(this.selected);

      this.modelSelected(this.selected);
    }
  }

  modelSelected(event: any) {
    this.selected = event;

    if (this.selectedd.value) {
      let value;
      if (this.selectedd.type == 'Bool') {
        value = this.selectedd.value == 'true' ? true : false;
      } else {
        value = this.selectedd.value;
      }

      this.Value.patchValue(value);
      return;
    }

    if (this.selected?.type == 'Bool') {
      this.Value.setValue(false);
    }
  }

  onSubmit() {
    let model = this.packageForm.value;
    if (!this.selectedd && this.packageForm.valid) {
      let details = {
        name: model.crite.name,
        columnType: model.crite.type,
        packageId: this.packageId,
        value: model.value,
      };
      console.log(details);
      this.packageService.creatPackgeDetails(details);
    } else if (this.selectedd && this.packageForm.valid) {
      let details = {
        id: this.selectedd.id,
        name: model.crite.name,
        columnType: model.crite.type,
        packageId: this.packageId,
        value: model.value,
      };

      this.packageService.updatePackageDetails(details);
    }

    this.displayForm = false;
  }
  resetForm() {
    this.form.resetForm();
    this.selected = null;
    if (this.selected?.type == 'Bool') {
      this.Value.setValue(false);
    }
  }

  onDelete(id: any) {
    this.packageService.deletePackageDetails(id);
  }
}
