import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthResponseData } from '../core/auth/auth.service';
import { AttachmentService } from '../core/services/attachment.service';
import { DynamicFormsService } from '../core/services/dynamic-forms.service';
import { ErrorService } from '../core/services/error.service';
import { LangService } from '../core/services/lang.service';
import { LocalStorageServiceService } from '../core/services/local-storage-service.service';
import { MangmentService } from '../core/services/mangment.service';
import { NotificationService } from '../core/services/notification.service';
import { UserService } from '../core/services/user.service';
import { AllUserDetails } from '../shared/models/all-user-details';
import {
  Notification,
  NotificationsResponse,
} from '../shared/models/notification';
import { Roles } from '../shared/models/roles';
import { Task } from '../shared/models/task';
import { UserDetails } from '../shared/models/user-details';
import { PollItem } from './models/poll-item.model';
import { Poll } from './models/poll.model';
import { RiskMangmentServicesService } from './services/risk-mangment-services.service';

@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styleUrls: ['./company-dashboard.component.scss'],
})
export class CompanyDashboardComponent implements OnInit {
  @ViewChild(FormGroupDirective) form!: FormGroupDirective;
  @ViewChild('dynamicForm') dynamicForm!: FormGroupDirective;
  @ViewChild('deputyDirector') formClose!: ElementRef;
  @ViewChild('success') succes!: ElementRef;
  @ViewChild('dynamic') dynamic!: ElementRef;
  @ViewChild('surveys') surveys!: ElementRef;
  @ViewChild('surveys2') surveys2!: ElementRef;
  @ViewChild('pollFormD', { static: true })
  pollFormDirective!: FormGroupDirective;
  @ViewChild('tform', { static: true })
  tform!: FormGroupDirective;
  @ViewChild('taskDetails', { static: true }) taskDetails!: ElementRef;
  @ViewChild('taskUpdate', { static: true }) taskUpdate!: ElementRef;
  @ViewChild('closeUpdate', { static: true }) closeUpdate!: ElementRef;

  employeForm!: FormGroup;
  user!: AllUserDetails;
  userDetails!: UserDetails;
  companyId!: number;
  subscriptionTypeId!: number;
  role!: any;
  delegatedUser!: AuthResponseData;
  hide = false;
  pollItems: Poll[] = [];
  pollForm!: FormGroup;
  defaultPolls: PollItem[] = [];
  public allRoles = Roles;
  employees!: any[];
  notifications: Notification[] = [];
  allNotifications!: NotificationsResponse;
  selectedNotify!: Notification;
  assignList!: UserDetails[];
  updateForm!: FormGroup;
  userForm!: FormGroup;
  taskLevels: any = [];
  taskStatus: any = [];
  userPhotoUrl!: string;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private userService: UserService,
    private localService: LocalStorageServiceService,
    private errorServices: ErrorService,
    private riskManagementServ: RiskMangmentServicesService,
    private notificationsService: NotificationService,
    private langService: LangService,
    private deptService: MangmentService,
    private dynamicService: DynamicFormsService,
    private attachmentService: AttachmentService
  ) {
    /* ---------------------------------- form ---------------------------------- */
    this.employeForm = this.fb.group({
      fullName: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],

      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      phoneNumber: [null, [Validators.required]],
    });

    this.pollForm = this.fb.group({
      name: [null, Validators.required],
    });

    /* -------------------------------- task form ------------------------------- */
    this.updateForm = this.fb.group({
      assignedToId: [null, Validators.required],
      description: [null, Validators.required],
      tasksStatusId: [null, Validators.required],
    });

    /* -------------------------------- user form ------------------------------- */
    this.userForm = this.fb.group({
      fullName: [null, Validators.required],
      username: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      email: [],
    });
  }

  ngOnInit() {
    this.loadUserInfo();
    this.loadNotifications();
    this.loadTaskLevels();
    this.loadTaskStatus();
    this.userService.getUpdates().subscribe((data) => {
      this.employees = [...data];
    });

    /* ----------------------------- listen to polls ---------------------------- */
    this.riskManagementServ.getUpdates().subscribe(
      (data: any) => {
        this.pollItems = [...data];
      },
      (err) => {
        this.errorServices.handleError(err);
      }
    );
  }

  public get Name(): FormControl {
    return this.employeForm.get('fullName') as FormControl;
  }

  public get Email(): FormControl {
    return this.employeForm.get('email') as FormControl;
  }

  public get Phone(): FormControl {
    return this.employeForm.get('phoneNumber') as FormControl;
  }

  public get AssignedToId(): FormControl {
    return this.updateForm.get('assignedToId') as FormControl;
  }

  public get Description(): FormControl {
    return this.updateForm.get('description') as FormControl;
  }

  public get TasksStatusId(): FormControl {
    return this.updateForm.get('tasksStatusId') as FormControl;
  }

  public get Username(): FormControl {
    return this.userForm.get('username') as FormControl;
  }

  public get FullName(): FormControl {
    return this.userForm.get('fullName') as FormControl;
  }
  public get PhoneNumber(): FormControl {
    return this.userForm.get('phoneNumber') as FormControl;
  }

  public get Email2(): FormControl {
    return this.userForm.get('email') as FormControl;
  }
  onSubmit() {
    if (this.employeForm.valid) {
      let user = this.employeForm.value;
      user.companyId = this.companyId;
      user.subscriptionTypeId = this.subscriptionTypeId;

      this.userService.delegateAdmin(user).subscribe((data) => {
        this.delegatedUser = data;
        this.form?.resetForm();
        this.formClose.nativeElement.click();
        this.succes.nativeElement.click();
      });
    }
  }

  navigateToDash() {
    this.router.navigate(['/company-dashboard/dash']);
  }

  navigateToAttachments() {
    this.hide = true;
    this.router.navigate(['/company-dashboard/upload-attachments']);
  }

  onSurveysOpen() {
    this.riskManagementServ.GetPollsByCompanyId(this.companyId);
    this.surveys.nativeElement.click();
  }

  onCreatePoll() {
    if (this.pollForm.valid) {
      let model = this.pollForm.value;
      model.totalEmployees = 0;
      model.companyId = this.companyId;
      this.riskManagementServ.CreatePoll(model);
      this.pollFormDirective.resetForm();
    }
  }

  loadUserInfo() {
    this.userService.getUser().subscribe(
      (data) => {
        this.user = data;
        this.companyId = data.companyId;
        this.subscriptionTypeId = data.subscriptionTypeId;
        this.localService.CompanyId = this.companyId;
      },
      (err) => {
        this.errorServices.handleError(err);
      }
    );

    this.userService.getUserDetails().subscribe(
      (user) => {
        this.userDetails = user;
        this.localService.DeptId = user.user.userDepartments[0].id;
        this.role = this.userDetails.user.userRoles[0]?.name;
        this.localService.UserRole = this.role;
        console.log('details', this.userDetails);
      },
      (err) => {
        this.errorServices.handleError(err);
      }
    );
  }

  loadDefaultPolls() {
    this.riskManagementServ.GetDefaultPollItems().subscribe(
      (data) => {
        this.defaultPolls = [...data];
        this.surveys2.nativeElement.click();
      },
      (err) => {
        this.errorServices.handleError(err);
      }
    );
  }

  openRiskTeamForm(modalTrigger: HTMLButtonElement) {
    this.userService.getAllUserByDeptId(
      this.userDetails.user.userDepartments[0].id
    );

    modalTrigger.click();
  }

  loadNotifications() {
    this.notificationsService.GetNotificationsByUserId(
      this.localService.UserId
    );

    this.notificationsService.getUpdates().subscribe((data) => {
      debugger;
      this.notifications = data?.notifications?.filter((e) => e.isRead != true);
      this.allNotifications = data;
    });
  }

  convertDateToLocal(date: string | any) {
    return new Date(date).toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  onNotificationClick(notification: Notification) {
    this.notificationsService.onNotificationSeen(notification);

    let taskDetails = [1, 2, 3, 4, 6, 7, 8, 9];
    if (notification.notificationTypeId == 11) {
      this.router.navigate(['/company-dashboard/poll', notification.pollId]);
    }

    if (taskDetails.includes(notification.notificationTypeId)) {
      this.taskDetails.nativeElement.click();
    }

    if (
      notification.notificationTypeId == 10 ||
      notification.notificationTypeId == 5
    ) {
      this.loadAssignList();

      this.selectedNotify = notification;
      this.selectedNotify.tasks.taskLocation = JSON.parse(
        this.selectedNotify.tasks.taskLocation
      );
      this.updateForm.patchValue(this.selectedNotify.tasks);

      this.taskUpdate.nativeElement.click();
    }
  }

  isInRiskManagement() {
    if (this.userDetails?.user.userDepartments[0]?.correspondingDeptId == 142) {
      return true;
    }

    return false;
  }

  isRiskManger() {
    if (this.userDetails?.user.userRoles[0]?.name == Roles[12]) {
      return true;
    } else {
      return false;
    }
  }

  loadAssignList() {
    this.deptService
      .GetEmployeeInDept(
        this.userDetails.user.id,
        this.userDetails.user.company.id
      )
      .subscribe((data: any) => {
        this.assignList = [];
        this.assignList = [...data];
      });
  }

  getTaskLevelName(task: any) {
    return this.taskLevels.find((e: any) => e.id == task?.tasksLevelId)?.name;
  }

  onTaskUpdated() {
    console.log(this.selectedNotify);
    let user = this.AssignedToId.value;
    if (this.updateForm.valid) {
      let model = this.updateForm.value;
      model.id = this.selectedNotify.tasks?.id;
      model.companyid = this.companyId;
      model.taskslevelid = this.selectedNotify.tasks.tasksLevelId;
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
        model.managementId = this.selectedNotify.tasks.managementId;
        model.departementId = this.selectedNotify.tasks.departementId;
        model.teamId = this.selectedNotify.tasks.teamId;
      }

      this.dynamicService.UpdateTasks(model).subscribe(
        () => {
          this.resetForm();
          Swal.fire({ icon: 'success', title: 'تم التعديل بنحاح' }).then(() => {
            this.closeUpdate.nativeElement.click();
          });
        },
        (err) => {
          this.errorServices.handleError(err);
        }
      );
    }
  }

  resetForm() {
    this.tform.resetForm();
  }

  loadTaskStatus() {
    this.dynamicService.getAllTaskStatus().subscribe((data: any) => {
      this.taskStatus = data;
      console.log(data);
    });
  }

  loadTaskLevels() {
    this.dynamicService.getAllTasksLevel().subscribe((data: any) => {
      this.taskLevels = data;
      console.log(data);
    });
  }

  onUserImageUpload(event: any) {
    this.userPhotoUrl = this.createImageUrl(event.target.files[0]);

    this.userDetails.user.userPhoto = this.userPhotoUrl;
    this.attachmentService
      .convertToBase64(event?.target.files[0])
      .then((data) => {
        let model = {
          imageBase: data.split(',')[1],
          imageName: 'userPhoto.' + event.target.files[0].name.split('.').pop(),
          userId: this.user?.id,
        };

        this.userService.updateUserPhoto(model).subscribe(() => {
          this.userDetails.user.userPhoto = this.userPhotoUrl;
        });
      });
  }

  onUpdateFormOpen() {
    this.userPhotoUrl = this.userDetails.user.userPhoto;
    this.userForm.patchValue(this.userDetails.user);
  }

  onUserUpdate(ref: HTMLButtonElement) {
    console.log('user update', this.userForm);

    if (this.userForm.valid) {
      this.userService
        .updateUser(this.userDetails.user.id, this.userForm.value)
        .subscribe(() => {
          this.loadUserInfo();
          ref.click();
        });
    }
  }

  createImageUrl(image: any) {
    let url = URL.createObjectURL(image);
    return url;
  }

  toggleAssignValidator(id: number) {
    let list = [6, 9, 10, 8];

    if (list.includes(id)) {
      this.AssignedToId.clearValidators();
      this.AssignedToId.updateValueAndValidity();
    } else {
      this.AssignedToId.setValidators([Validators.required]);
      this.AssignedToId.updateValueAndValidity();
    }
  }
}
