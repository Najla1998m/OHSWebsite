import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { DynamicFormsService } from 'src/app/modules/core/services/dynamic-forms.service';
import { ErrorService } from 'src/app/modules/core/services/error.service';
import { ExcelService } from 'src/app/modules/core/services/excel.service';
import { LocalStorageServiceService } from 'src/app/modules/core/services/local-storage-service.service';
import { MangmentService } from 'src/app/modules/core/services/mangment.service';

import { UserService } from 'src/app/modules/core/services/user.service';
import { Department } from 'src/app/modules/shared/models/department';
import { Roles } from 'src/app/modules/shared/models/roles';
import { UserDetails } from 'src/app/modules/shared/models/user-details';
import Swal from 'sweetalert2';
import { NavigationService } from '../../services/navigation.service';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  @ViewChild('taskDetails') taskDetails!: ElementRef;
  @ViewChild('closeUpdate') closeUpdate!: ElementRef;
  @ViewChild('form') taskFormGroup!: FormGroupDirective;
  listManagement: Department[] = [];
  companyId!: number;
  totalCount!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  tasks!: any[];
  p1!: number;
  p2!: number;
  p3!: number;
  taskLevels!: any[];
  taskStatus!: any[];
  selectedManagement!: Department | null;
  userRole!: any;
  managementId!: number;
  selectedTask!: any;
  updateForm!: FormGroup;
  assignList!: UserDetails[];

  constructor(
    private mangeService: MangmentService,
    private tasksService: TasksService,
    private localService: LocalStorageServiceService,
    private dynamicServ: DynamicFormsService,
    private excelService: ExcelService,
    public navigationService: NavigationService,
    private fb: FormBuilder,
    private dynamicService: DynamicFormsService,
    private errorService: ErrorService,
    private deptService: MangmentService
  ) {
    this.userRole = this.localService.UserRole;

    this.updateForm = this.fb.group({
      assignedToId: [null, Validators.required],
      description: [null, Validators.required],
      tasksStatusId: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.companyId = this.localService.CompanyId;
    this.managementId = this.localService.DeptId;
    this.loadManagements();
    this.loadAssignList();
    this.loadTaskLevels();
    this.loadTaskStatus();

    /* -------------------------------- task form ------------------------------- */
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

  // slider Handler Images

  scrollNext() {
    let slider = document.getElementById('slider')!;
    slider.scrollBy(200, 0);
  }

  scrollPrev() {
    let slider = document.getElementById('slider')!;
    slider.scrollBy(-200, 0);
  }

  onClick(event: any) {
    event;
    ('clicked');
  }

  paginate(event: number) {
    this.pageNumber = event;
  }

  selectManagement(event: Department) {
    if (event == this.selectedManagement) {
      this.selectedManagement = null;
    } else {
      this.selectedManagement = event;
      this.loadTasksByManagementId(this.selectedManagement.id);
    }
  }

  loadManagements() {
    this.mangeService.getAll(this.companyId);
    this.mangeService.getUpdates().subscribe((res) => {
      this.listManagement = [...res];
    });
  }

  loadAssignList() {
    this.deptService
      .GetEmployeeInDept(this.localService.UserId, this.companyId)
      .subscribe((data: any) => {
        this.assignList = [];
        this.assignList = [...data];
      });
  }

  loadTasksByManagementId(id: any) {
    this.tasksService.GetTasksForManagement(id).subscribe((data: any) => {
      this.tasks = [...data];
      console.log('asdasd', data);
    });
  }

  loadTaskStatus() {
    this.dynamicServ.getAllTaskStatus().subscribe((data: any) => {
      this.taskStatus = data;
      console.log(data);
    });
  }

  loadTaskLevels() {
    this.dynamicServ.getAllTasksLevel().subscribe((data: any) => {
      this.taskLevels = data;
      console.log(data);
    });
  }

  getTaskStatus(id: number) {
    return this.taskStatus.find((e) => e.id == id).name;
  }

  getTaskLevel(id: number) {
    return this.taskLevels.find((e) => e.id == id).name;
  }

  getStatus(status: any) {
    let word = 'غير معروفة';
    word = this.taskStatus?.find((e) => e.id == status)?.name;
    return word;
  }

  convertDateToLocal(date: string | any) {
    return new Date(date).toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  onTaskPreview(task: any) {
    this.selectedTask = task;
    this.updateForm.patchValue(this.selectedTask);
    this.taskDetails.nativeElement.click();
  }

  resetForm() {
    this.taskFormGroup.resetForm();
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
            Swal.fire({ icon: 'success', title: 'تم التعديل بنحاح' }).then(
              () => {
                this.closeUpdate.nativeElement.click();
                this.loadTasksByManagementId(this.selectedManagement?.id);
              }
            );
            this.resetForm();
          },
          (err: HttpErrorResponse) => {
            this.errorService.handleError(err);
          }
        );
      }
    }
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
      let creator = e.creator ? e.creator.fullName : 'غير متوفر';
      let assignedTo = e.assignedTo ? e.assignedTo.fullName : 'غير متوفر';
      let targetLoc = e.taskLocation ? e.taskLocation.address : 'غير متوفر';
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
        targetTime = 'غير متوفر';
      }

      return {
        '#': i,
        'رقم المهمة': e.number,
        'منشئ المهمة': creator,
        'تفويض إلي': assignedTo,
        'تاريخ الإنشاء': date,
        'حالة المهمة': status,
        'تصنيف المهمة': taskLevel,
        'وصف المهمة': e.description,
        'التاريخ المستهدف': targetDate,
        'الوقت المستهدف': targetTime,
        'الموقع المستهدف': targetLoc,
      };
    });

    this.excelService.exportAsExcelFile(excelData, 'sample');
  }

  loadData() {
    this.loadManagements();
    this.loadAssignList();
    this.loadTaskLevels();
    this.loadTaskStatus();
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

    if (list.includes(id)) {
      this.AssignedToId2.clearValidators();
      this.AssignedToId2.updateValueAndValidity();
    } else {
      this.AssignedToId2.setValidators([Validators.required]);
      this.AssignedToId2.updateValueAndValidity();
    }
  }
}
