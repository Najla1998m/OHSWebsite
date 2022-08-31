import { MapsAPILoader, MouseEvent } from '@agm/core';
import {
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { arLocale, defineLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import {
  BsDatepickerConfig,
  BsDatepickerDirective,
  BsLocaleService,
} from 'ngx-bootstrap/datepicker';
import { DynamicFormsService } from 'src/app/modules/core/services/dynamic-forms.service';
import { ErrorService } from 'src/app/modules/core/services/error.service';
import { LangService } from 'src/app/modules/core/services/lang.service';
import { LocalStorageServiceService } from 'src/app/modules/core/services/local-storage-service.service';
import { SiteSettingsService } from 'src/app/modules/core/services/site-settings.service';
import { UserService } from 'src/app/modules/core/services/user.service';
import { AllUserDetails } from 'src/app/modules/shared/models/all-user-details';
import { Form } from 'src/app/modules/shared/models/form';
import { FormItem } from 'src/app/modules/shared/models/form-item';
import { Roles } from 'src/app/modules/shared/models/roles';
import { UserDetails } from 'src/app/modules/shared/models/user-details';
import Swal from 'sweetalert2';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-dashboard-operations',
  templateUrl: './dashboard-operations.component.html',
  styleUrls: ['./dashboard-operations.component.scss'],
})
export class DashboardOperationsComponent implements OnInit {
  @ViewChild('dynamicForm') dynamicForm!: FormGroupDirective;
  @ViewChild('dynamic') dynamic!: ElementRef;
  @ViewChild('close') closeBtn!: ElementRef;
  @ViewChild('parentForm') parent!: ElementRef;
  @ViewChild('location', { static: true }) searchElementRef!: ElementRef;
  @ViewChild(BsDatepickerDirective, { static: false })
  datepicker?: BsDatepickerDirective;

  buttons!: any[];
  dFrom!: FormGroup;
  dynamicFormModel!: Form;
  taskLevels!: any[];
  taskStatus!: any[];
  companyUsers!: any[];
  slidesNumber!: any;
  colorTheme = 'theme-default';
  bsConfig!: Partial<BsDatepickerConfig>;
  minDate!: any;
  maxDate!: any;
  userRole!: any;
  role!: any;
  user!: AllUserDetails;
  userDetails!: UserDetails;
  companyId!: number;
  selectedForm!: any;
  subForms: any[] = [];
  data2: any;
  data: any;
  max: any;
  latitude!: number;
  longitude!: number;
  zoom: number = 14;
  address!: string;
  private geoCoder!: any;

  isReady: boolean = false;

  constructor(
    private siteServices: SiteSettingsService,
    private fb: FormBuilder,
    public router: Router,
    private userService: UserService,
    private localService: LocalStorageServiceService,
    private dynamicService: DynamicFormsService,
    private errorServices: ErrorService,
    public lang: LangService,
    private localeServiceDate: BsLocaleService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    public navigationService: NavigationService
  ) {
    this.dFrom = this.fb.group({
      assignedToId: [null, Validators.required],
      description: [null, Validators.required],
      tasksLevelId: [null, Validators.required],
      tasksStatusId: [null, Validators.required],
      taskLocation: [null],
      targetDate: [null, Validators.required],
      targetTime: [new Date(), Validators.required],
      ExtraFields: this.fb.group({}),
    });

    defineLocale('ar', arLocale);
    defineLocale('en', enGbLocale);

    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate() + 60);

    this.lang.getCurrentLang() == 'ar'
      ? this.localeServiceDate.use('ar')
      : this.localeServiceDate.use('en');
    // listen to the current language
    this.lang.getIsLangArHandler().subscribe((isLangAr) => {
      if (isLangAr) {
        this.localeServiceDate.use('ar');
      } else {
        this.localeServiceDate.use('en');
      }
    });
  }

  ngOnInit() {
    //set map

    this.loadData();
  }

  public get AssignedToId(): FormControl {
    return this.dFrom.get('assignedToId') as FormControl;
  }

  public get description(): FormControl {
    return this.dFrom.get('description') as FormControl;
  }
  public get tasksLevelId(): FormControl {
    return this.dFrom.get('tasksLevelId') as FormControl;
  }
  public get tasksStatusId(): FormControl {
    return this.dFrom.get('tasksStatusId') as FormControl;
  }
  public get taskLocation(): FormControl {
    return this.dFrom.get('taskLocation') as FormControl;
  }
  public get targetDate(): FormControl {
    return this.dFrom.get('targetDate') as FormControl;
  }
  public get targetTime(): FormControl {
    return this.dFrom.get('targetTime') as FormControl;
  }
  public get ExtraFields(): FormGroup {
    return this.dFrom.get('ExtraFields') as FormGroup;
  }

  createForm() {
    debugger;
    // this.dFrom.reset();
    // this.dFrom.removeControl('ExtraFields');
    // this.dFrom.updateValueAndValidity();

    // this.dFrom.addControl('ExtraFields', this.fb.group({}));

    (this.dFrom.get('ExtraFields') as FormGroup).controls = {};
    let list: any;
    if (this.dynamicFormModel) {
      for (const item of this.dynamicFormModel.formItems) {
        list = '[' + item.formItemType.roles + ']';
        list = String(list);

        if (item?.formItemType?.name == 'Bool') {
          (this.dFrom.get('ExtraFields') as FormGroup).addControl(
            (item as FormItem).name,
            new FormControl(false, [Validators.required])
          );
        } else {
          (this.dFrom.get('ExtraFields') as FormGroup).addControl(
            (item as FormItem).name,
            new FormControl(null, [Validators.required])
          );
        }
      }
    }

    console.log((this.dFrom.get('ExtraFields') as FormGroup).controls);

    this.openForm();
    let timer = setTimeout(() => this.loadMap(), 500);
  }

  openForm() {
    this.dynamic.nativeElement.click();
  }

  dynamicFormSubmit() {
    debugger;
    let s = this.ExtraFields.controls;
    if (this.dFrom.valid) {
      let model = this.dFrom.value;
      model.creatorId = this.userDetails.user.id;

      console.log(this.AssignedToId.value);

      if (
        this.AssignedToId?.value?.userRoles[0]?.name == Roles[11] ||
        this.AssignedToId?.value?.userRoles[0]?.name == Roles[14] ||
        this.AssignedToId?.value?.userRoles[0]?.name == Roles[12]
      ) {
        model.managementId = this.AssignedToId?.value?.userDepartments[0].id;
      }

      if (this.AssignedToId.value?.userRoles[0]?.name == Roles[8]) {
        model.departementId = this.AssignedToId.value?.userDepartments[0]?.id;
      }

      if (this.AssignedToId.value?.userRoles[0]?.name == Roles[3]) {
        model.teamId = this.AssignedToId.value?.userDepartments[0]?.id;
      }

      model.assignedToId = this.AssignedToId.value.id;

      model.notificationTypeId = model.tasksLevelId == 9 ? 5 : 10;

      model.companyId = this.companyId;
      model.FormId = this.dynamicFormModel.id;
      model.creatorId = this.user.id;
      let enhancedExtraFields: any = {};

      for (const key in model.ExtraFields) {
        let item: string = this.dynamicFormModel.formItems.find(
          (e: FormItem) => e.name == key
        )?.displayNameAr;
        Object.assign(enhancedExtraFields, { [item]: model.ExtraFields[key] });
      }

      // if ((enhancedExtraFields = {})) {
      //   enhancedExtraFields = null;
      // }

      model.ExtraFields = JSON.stringify(enhancedExtraFields);

      this.dynamicService.createTask(model).subscribe(
        () => {
          Swal.fire('Success', '', 'success');
          this.closeBtn.nativeElement.click();
          debugger;
          location.reload();
        },
        (err) => {
          this.errorServices.handleError(err);
        }
      );
    } else {
      return;
    }
  }

  resetForm() {
    this.dynamicForm?.resetForm();
    this.selectedForm = null;
    this.isReady = false;
    location.reload();
  }

  getForm(item: any) {
    if (item?.settingType == 'FormButtonWithChilds') {
      this.dynamicService
        .getAllFormsByDepartmentId(+item.value)
        .subscribe((data) => {
          this.subForms = this.buttons.filter(
            (e) => e.value == item?.value && e != item
          );
        });
      this.parent.nativeElement.click();
    } else {
      this.fireForm(item);
    }
  }

  fireForm(item: any) {
    this.selectedForm = item;
    this.dynamicService
      .getAllFormsByDepartmentId(+item.value)
      .subscribe((res: any) => {
        console.log('res', res);
        console.log(item);
        debugger;
        this.dynamicFormModel = res.find(
          (e: any) => e.displayNameAr == item.key
        );

        console.log('dsds', this.dynamicFormModel);

        this.dynamicService
          .GetTasksForForm(this.dynamicFormModel.id)
          .subscribe((res: any) => {
            this.max = res.length ? res.length : 0;
            let finished = res.filter((e: any) => e.tasksStatusId == 6).length;
            if (this.max != 0) {
              this.data = Math.ceil(this.data);
              this.data = (finished / this.max) * 100;

              this.data = Math.round(this.data);
            } else {
              this.data = 0;
              finished = 0;
            }

            this.data2 = [
              {
                name: 'عدد المهام الكلي',
                value: this.max,
              },
              {
                name: 'المنتهية',
                value: finished,
              },
              {
                name: 'باقي المهام',
                value: this.max - finished,
              },
            ];
            this.isReady = true;

            if (this.dynamicFormModel) {
              if (this.dynamicFormModel?.formItems.length != 0) {
                this.slidesNumber =
                  +this.dynamicFormModel?.formItems[
                    this.dynamicFormModel?.formItems.length - 1
                  ].value;

                this.slidesNumber = [...new Array(this.slidesNumber)];
              } else {
                this.slidesNumber = [...new Array(1)];
              }

              this.createForm();
            } else {
              Swal.fire({
                icon: 'error',
                text: 'هذه الفورمة غير موجوده',
              });
            }
          });
      });
  }

  // Get Current Location Coordinates
  public setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  getAddress(latitude: any, longitude: any) {
    this.geoCoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results: any, status: any) => {
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 14;
            this.address = results[0].formatted_address;
            (document.getElementById('location') as HTMLInputElement).value =
              this.address;
            this.taskLocation.setValue(
              JSON.stringify({
                address: (
                  document.getElementById('location') as HTMLInputElement
                ).value,
                longitude: this.longitude,
                latitude: this.latitude,
                zoom: this.zoom,
              })
            );
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

  markerDragEnd(event: MouseEvent) {
    this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }

  loadMap() {
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      if (document.getElementById('location') as HTMLInputElement) {
        let autocomplete = new google.maps.places.Autocomplete(
          document.getElementById('location') as HTMLInputElement
        );
        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();

            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            // this.form
            //   .get('departementLocation')
            //   ?.setValue(JSON.stringify(place.geometry));

            //set latitude, longitude and zoom

            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.zoom = 14;

            this.taskLocation.setValue(
              JSON.stringify({
                address: (
                  document.getElementById('location') as HTMLInputElement
                ).value,
                longitude: this.longitude,
                latitude: this.latitude,
                zoom: this.zoom,
              })
            );
          });
        });
      }
    });
  }

  @HostListener('window:scroll')
  onScrollEvent() {
    this.datepicker?.hide();
  }

  loadData() {
    this.siteServices.GetFormButtons().subscribe((data: any) => {
      this.buttons = [...data];
    });

    this.userService.getUser().subscribe((data) => {
      this.user = data;
      this.companyId = data.companyId;

      this.localService.CompanyId = this.companyId;

      this.dynamicService
        .getAllUsersInCompany(this.companyId)
        .subscribe((data: any) => {
          this.companyUsers = data;
        });
    });

    this.userService.getUserDetails().subscribe((user) => {
      this.userDetails = user;
      this.role = this.userDetails.user.userRoles[0].name;
      this.localService.UserRole = this.role;
    });

    this.dynamicService.getAllTasksLevel().subscribe((data: any) => {
      this.taskLevels = data;
    });

    this.dynamicService.getAllTaskStatus().subscribe((data: any) => {
      this.taskStatus = data;
    });
  }
}
