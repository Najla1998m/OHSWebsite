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

import { DynamicFormsService } from 'src/app/modules/core/services/dynamic-forms.service';
import { ErrorService } from 'src/app/modules/core/services/error.service';
import { LangService } from 'src/app/modules/core/services/lang.service';
import { LocalStorageServiceService } from 'src/app/modules/core/services/local-storage-service.service';
import { MangmentService } from 'src/app/modules/core/services/mangment.service';

import { Roles } from 'src/app/modules/shared/models/roles';
import { UserDetails } from 'src/app/modules/shared/models/user-details';
import Swal from 'sweetalert2';
import { TasksService } from '../../../services/tasks.service';

import {
  BsDatepickerConfig,
  BsDatepickerDirective,
  BsLocaleService,
} from 'ngx-bootstrap/datepicker';
import { arLocale, defineLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import { ExcelService } from 'src/app/modules/core/services/excel.service';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-department-manager-tasks',
  templateUrl: './department-manager-tasks.component.html',
  styleUrls: ['./department-manager-tasks.component.scss'],
})
export class DepartmentManagerTasksComponent implements OnInit {
  @ViewChild('taskCreate') taskCreate!: ElementRef;
  @ViewChild('form') taskFormGroup!: FormGroupDirective;
  @ViewChild('close') close!: ElementRef;
  @ViewChild('taskDetails') taskDetails!: ElementRef;
  @ViewChild('closeUpdate') closeUpdate!: ElementRef;
  @ViewChild('search')
  public searchElementRef!: ElementRef<HTMLInputElement>;
  @ViewChild(BsDatepickerDirective, { static: false })
  datepicker?: BsDatepickerDirective;
  totalCount!: number;
  pageNumber: number = 1;
  pageNumber2: number = 1;
  pageSize: number = 10;
  taskLevels!: any[];
  taskStatus!: any[];
  userId!: string;
  companyId!: number;
  assignList!: UserDetails[];
  tasks!: any[];
  selectedTask!: any;
  taskForm!: FormGroup;
  latitude!: number;
  longitude!: number;
  zoom!: number;
  address!: string;
  private geoCoder!: any;
  minDate!: any;
  maxDate!: any;
  updateForm!: FormGroup;

  constructor(
    private tasksService: TasksService,
    private localServices: LocalStorageServiceService,
    private errorService: ErrorService,
    private dynamicService: DynamicFormsService,
    private deptService: MangmentService,
    private fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private localeServiceDate: BsLocaleService,
    public lang: LangService,
    private excelService: ExcelService,
    public navigationService: NavigationService
  ) {
    this.userId = this.localServices.UserId;
    this.companyId = this.localServices.CompanyId;

    this.taskForm = this.fb.group({
      assignedToId: [null, Validators.required],
      description: [null, Validators.required],
      tasksLevelId: [null, Validators.required],
      tasksStatusId: [null, Validators.required],
      taskLocation: [null, Validators.required],
      targetDate: [null, Validators.required],
      targetTime: [new Date(), Validators.required],
      name: [null, Validators.required],
    });

    /* -------------------------------- task form ------------------------------- */
    this.updateForm = this.fb.group({
      assignedToId: [null, Validators.required],
      description: [null, Validators.required],
      tasksStatusId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.loadAssignList();
    this.loadTaskLevels();
    this.loadTaskStatus();
    this.loadTasks();

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

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

    let timer = setTimeout(() => this.loadMap(), 500);
  }

  public get AssignedToId(): FormControl {
    return this.taskForm.get('assignedToId') as FormControl;
  }

  public get Description(): FormControl {
    return this.taskForm.get('description') as FormControl;
  }

  public get TasksLevelId(): FormControl {
    return this.taskForm.get('tasksLevelId') as FormControl;
  }

  public get TasksStatusId(): FormControl {
    return this.taskForm.get('tasksStatusId') as FormControl;
  }

  public get Name(): FormControl {
    return this.taskForm.get('name') as FormControl;
  }

  public get taskLocation(): FormControl {
    return this.taskForm.get('taskLocation') as FormControl;
  }
  public get targetDate(): FormControl {
    return this.taskForm.get('targetDate') as FormControl;
  }

  public get targetTime(): FormControl {
    return this.taskForm.get('targetTime') as FormControl;
  }

  public get AssignedToId2(): FormControl {
    return this.updateForm.get('assignedToId') as FormControl;
  }

  public get Description2(): FormControl {
    return this.updateForm.get('description') as FormControl;
  }

  public get TasksStatusId2(): FormControl {
    return this.updateForm.get('tasksStatusId') as FormControl;
  }

  paginate(event: number) {
    this.pageNumber = event;
  }

  loadTasks() {
    this.tasksService.GetTasksByUserId().subscribe(
      (data: any) => {
        console.log(data);

        this.tasks = [...data];
      },
      (err: any) => {
        this.errorService.handleError(err);
      }
    );
  }

  getStatus(status: any) {
    let word = '?????? ????????????';
    word = this.taskStatus?.find((e) => e.id == status)?.name;
    return word;
  }

  loadTaskStatus() {
    this.dynamicService.getAllTaskStatus().subscribe((data: any) => {
      this.taskStatus = data;
    });
  }

  loadTaskLevels() {
    this.dynamicService.getAllTasksLevel().subscribe((data: any) => {
      this.taskLevels = data;
    });
  }

  loadAssignList() {
    this.deptService
      .GetEmployeeInDept(this.userId, this.companyId)
      .subscribe((data: any) => {
        this.assignList = [];
        this.assignList = [...data];
      });
  }

  onTaskFormOpen() {
    this.taskCreate.nativeElement.click();
  }

  convertDateToLocal(date: string | any) {
    return new Date(date).toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  onTaskDeleted(id: number) {
    this.tasksService.DeleteTasksById(id).subscribe(
      () => {
        Swal.fire({ icon: 'success', title: '???? ?????????????? ??????????' }).then(() => {
          this.loadTasks();
        });
      },
      (err) => {
        this.errorService.handleError(err);
      }
    );
  }

  onTaskPreview(task: any) {
    this.selectedTask = task;
    this.updateForm.patchValue(this.selectedTask);
    this.taskDetails.nativeElement.click();
  }

  onSubmit() {
    if (this.taskForm.valid) {
      let model = this.taskForm.value;
      model.assignedToId = this.AssignedToId.value.id;
      model.teamId = this.AssignedToId.value?.userDepartments[0]?.id;
      model.notificationTypeId = 5;
      model.companyId = this.companyId;
      model.creatorId = this.userId;

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

      this.dynamicService.createTask(model).subscribe(
        () => {
          Swal.fire({ icon: 'success', title: '???? ?????????????? ??????????' }).then(() => {
            this.close.nativeElement.click();
            this.resetForm();
            this.loadTasks();
          });
        },
        (err) => {
          this.errorService.handleError(err);
        }
      );
    }
  }

  onTaskUpdated() {
    if (this.updateForm.valid) {
      let user = this.AssignedToId2.value;
      if (this.updateForm.valid) {
        let model = this.updateForm.value;
        model.id = this.selectedTask.id;
        model.companyid = this.companyId;
        model.taskslevelid = this.selectedTask.tasksLevelId;
        if (typeof user != 'string') {
          model.assignedToId = user?.id;

          if (user.userRoles[0].name == Roles[12]) {
            model.managementId = user.userDepartments[0].id;
          }

          if (user.userRoles[0].name == Roles[8]) {
            model.departementId = user.userDepartments[0].id;
          }

          if (user.userRoles[0].name == Roles[3]) {
            model.teamId = user.userDepartments[0].id;
          }

          if (
            user.userRoles[0].name == Roles[11] ||
            user.userRoles[0].name == Roles[14] ||
            user.userRoles[0].name == Roles[12]
          ) {
            model.managementId = user.userDepartments[0].id;
          } else if (user.userRoles[0].name == Roles[8]) {
            model.departementId = user.userDepartments[0].id;
          } else if (user.userRoles[0].name == Roles[3]) {
            model.teamId = user.userDepartments[0].id;
          }
        } else {
          model.managementId = this.selectedTask.managementId;
          model.departementId = this.selectedTask.departementId;
          model.teamId = this.selectedTask.teamId;
        }

        this.dynamicService.UpdateTasks(model).subscribe(
          () => {
            this.resetForm();
            Swal.fire({ icon: 'success', title: '???? ?????????????? ??????????' }).then(
              () => {
                this.closeUpdate.nativeElement.click();
                this.loadTasks();
              }
            );
          },
          (err) => {
            this.errorService.handleError(err);
          }
        );
      }
    }
  }

  resetForm() {
    this.taskFormGroup.resetForm();
  }

  getTaskLevel(id: number) {
    return this.taskLevels.find((e) => e.id == id).name;
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

  print() {
    let popup: any;
    let data = document.getElementById('empPayslip')?.innerHTML;

    popup = window.open(`print`, `_blank`);

    console.log(popup.document);

    if (
      typeof popup != 'undefined' &&
      popup.document &&
      popup.document.readyState == 'complete'
    ) {
      // do stuff
    }
    popup.document.write(`
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.1/dist/css/bootstrap.min.css" integrity="sha384-zCbKRCUGaJDkqS1kPbPd7TveP5iyJE0EjAuZQTgFLD2ylzuqKfdKlfG/eSrtxUkn" crossorigin="anonymous">
  <style type="text/css">

      .stauts {
  width: 60px;
  height: 60px;
  background: #efefef;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 50%;
}

.stauts::before {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;

  bottom: 3px;
  right: 3px;
  border-radius: 50%;
}

.name {
  cursor: pointer;
  text-decoration: none;
  color: black;
}

.stautsDetails {
  width: 90px;
  height: 90px;
  background: #efefef;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 50%;
}

#detales {
    display:none;
  }
.btn-editt {
      display:none;
}

 #lock{
   display:none !important;;
 }
 
 *{
   text-align: start !important
 }

#img{
     margin: auto;
}
.fs {
  font-weight: 600;
  font-size: 1rem;
   padding: 0 19px;
    }
@media print{
  @page { size: landscape; }

  .stauts {
  width: 60px;
  height: 60px;
  background: #efefef;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 50%;
}

.stauts::before {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;

  bottom: 3px;
  right: 3px;
  border-radius: 50%;
}

.name {
  cursor: pointer;
  text-decoration: none;
  color: black;
}

.stautsDetails {
  width: 90px;
  height: 90px;
  background: #efefef;
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 50%;
}

#detales {
    display:none;
  }
.btn-editt {
      display:none;
}

 #lock{
   display:none !important;
 }
#img{
     margin: auto;
}
.fs {
  font-weight: 600;
  font-size: 1.3rem;
   padding: 0 19px;
    }

  </style>
</head>
<body onload="window.print()">
${data}
</body>
<script>
  setTimeout(()=>{
    window.addEventListener('load',window.print())
  },2000)
</script>
</html>`);
  }

  exportAsXLSX(): void {
    let excelData = this.tasks.map((e, i) => {
      let date = this.convertDateToLocal(e.createdAt);
      let status = this.getStatus(e.tasksStatusId);
      let creator = e.creator ? e.creator.fullName : '?????? ??????????';
      let assignedTo = e.assignedTo ? e.assignedTo.fullName : '?????? ??????????';
      let targetLoc = e.taskLocation ? e.taskLocation.address : '?????? ??????????';
      let targetDate = this.convertDateToLocal(e.targetDate);
      let taskLevel = this.taskLevels?.find(
        (t) => e.tasksLevelId == t.id
      )?.name;
      let targetTime;
      if (e.targetTime) {
        targetTime = new Date(e.targetTime).toLocaleDateString('ar-EG', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });
      } else {
        targetTime = '?????? ??????????';
      }

      return {
        '#': i,
        '?????? ????????????': e.number,
        '???????? ????????????': creator,
        '?????????? ??????': assignedTo,
        '?????????? ??????????????': date,
        '???????? ????????????': status,
        '?????????? ????????????': taskLevel,
        '?????? ????????????': e.description,
        '?????????????? ????????????????': targetDate,
        '?????????? ????????????????': targetTime,
        '???????????? ????????????????': targetLoc,
      };
    });

    this.excelService.exportAsExcelFile(excelData, 'sample');
  }

  loadData() {
    this.loadAssignList();
    this.loadTaskLevels();
    this.loadTaskStatus();
    this.loadTasks();
  }

  isEmpty(obj: Object) {
    return (
      obj &&
      Object.keys(obj).length === 0 &&
      Object.getPrototypeOf(obj) === Object.prototype
    );
  }

  toggleAssignValidator(id: number) {
    let list = [6, 9, 10, 8];
    console.log('dsadsa', this.AssignedToId2);

    if (list.includes(id)) {
      this.AssignedToId2.clearValidators();
      this.AssignedToId2.updateValueAndValidity();
    } else {
      this.AssignedToId2.setValidators([Validators.required]);
      this.AssignedToId2.updateValueAndValidity();
    }
  }
}
