import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { arLocale, defineLocale, enGbLocale } from 'ngx-bootstrap/chronos';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap/datepicker';
import { AuthService } from 'src/app/modules/core/auth/auth.service';
import { ErrorService } from 'src/app/modules/core/services/error.service';
import { LangService } from 'src/app/modules/core/services/lang.service';
import { LocalStorageServiceService } from 'src/app/modules/core/services/local-storage-service.service';
import { MangmentService } from 'src/app/modules/core/services/mangment.service';
import { UserService } from 'src/app/modules/core/services/user.service';
import { Roles } from 'src/app/modules/shared/models/roles';
import { UserDetails } from 'src/app/modules/shared/models/user-details';
import Swal from 'sweetalert2';
import { PollItem } from '../../models/poll-item.model';
import { RiskMangmentServicesService } from '../../services/risk-mangment-services.service';

interface detailsPoll {
  item: PollItem;
  agree: number;
  notAgree: number;
  unknown: number;
  agreeRate: number;
  approval: any;
  actions: [];
  remove: boolean;
  danger: {
    con1: number;
    con2: number;
  };
}

@Component({
  selector: 'app-poll-action',
  templateUrl: './poll-action.component.html',
  styleUrls: ['./poll-action.component.scss'],
})
export class PollActionComponent implements OnInit {
  @ViewChild('taskTitle') taskTitle!: ElementRef;
  @ViewChild('task') task!: ElementRef;
  @ViewChild(FormGroupDirective) form!: FormGroupDirective;
  @ViewChild('close') close!: ElementRef;

  colorTheme = 'theme-default';
  bsConfig!: Partial<BsDatepickerConfig>;
  minDate!: any;
  maxDate!: any;
  isInternalTask!: boolean;
  actionForm!: FormGroup;
  team!: UserDetails[];
  userId!: any;
  companyId!: number;
  managementId!: number;

  pollDetails!: any;
  pollId!: number;
  pollActionsArr = [
    {
      id: 0,
      name: 'إزالة',
    },
    {
      id: 1,
      name: 'الإستبدال',
    },
    {
      id: 2,
      name: 'الضوابط الهندسية',
    },
    {
      id: 3,
      name: 'الإجراءات الإدارية ',
    },
    {
      id: 4,
      name: 'أدوات الحماية الشخصية',
    },
  ];

  selected!: { action: any; pollItem: any };

  constructor(
    private ar: ActivatedRoute,
    private pollService: RiskMangmentServicesService,
    private localServices: LocalStorageServiceService,
    private localeServiceDate: BsLocaleService,
    private lang: LangService,
    private fb: FormBuilder,
    private router: Router,
    private deptServices: MangmentService,
    private errorServices: ErrorService,
    private authServices: AuthService,
    private userServ: UserService
  ) {
    this.ar.params.subscribe((url) => {
      this.pollId = url.id;
    });

    this.pollDetails = this.router.getCurrentNavigation()?.extras.state;

    this.authServices.user.subscribe((user) => {
      this.userId = user?.getUserId();
    });
    this.userId = localServices.UserId;
    this.companyId = localServices.CompanyId;
    this.loadRiskEmployees();

    this.actionForm = this.fb.group({
      assignedToId: [null, Validators.required],
      description: [null, Validators.required],
      targetDate: [null, Validators.required],
      targetTime: [new Date(), Validators.required],
      extraFields: fb.group({
        recommendation: [null],
        taskName: [null, Validators.required],
        ohsRecommendation: [null],
      }),
    });
  }

  public get AssignedToId(): FormControl {
    return this.actionForm.get('assignedToId') as FormControl;
  }

  public get Description(): FormControl {
    return this.actionForm.get('description') as FormControl;
  }

  public get targetTime(): FormControl {
    return this.actionForm.get('targetTime') as FormControl;
  }

  public get TaskName(): FormControl {
    return this.actionForm.get('extraFields')?.get('taskName') as FormControl;
  }

  public get Recommendation(): FormControl {
    return this.actionForm
      .get('extraFields')
      ?.get('recommendation') as FormControl;
  }

  public get TargetDate(): FormControl {
    return this.actionForm.get('targetDate') as FormControl;
  }

  public get OhsRec(): FormControl {
    return this.actionForm
      .get('extraFields')
      ?.get('ohsRecommendation') as FormControl;
  }

  ngOnInit() {
    defineLocale('ar', arLocale);
    defineLocale('en', enGbLocale);

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

  loadRiskEmployees() {
    this.userServ
      .GetAllSupervisrosInCompany(this.companyId)
      .subscribe((data: any) => {
        this.team = [];
        this.team = [...data];
      });
  }

  loadSupportEmployee() {
    this.team = [];
    this.deptServices.GetEmployeeInDept(null, 1).subscribe((data: any) => {
      console.log('support Emp', data);

      if (typeof data == 'object') {
        this.team.push(data);
      } else {
        this.team = [...data];
      }
    });
  }

  onSelected(item: any, pollItem: detailsPoll) {
    //1 get poll item
    const index = this.pollDetails.findIndex(
      (e: any) => e.item == pollItem.item
    );
    if (index == -1) return;
    let selected: any = this.pollDetails[index];

    //2 check if Action is Selected before
    if (selected.action?.includes(item)) {
      selected.action = selected.action.filter((e: any) => e.id != item.id);
      if (item.id == 0) selected.remove = false;
      this.pollDetails[index] = selected;
      return;
    }

    if (selected.remove) {
      return;
    }

    if (item.id == 0) {
      selected.action = [];
      selected.remove = true;
      selected.action?.push(item);
    } else {
      selected.action?.push(item);
      console.log('selected Actions', item.name);

      console.log('selected aCTIONS', selected.action);
    }

    this.pollDetails[index] = selected;
  }

  isSelected(action: any, item: any) {
    return item.action?.includes(action);
  }

  onTaskCreate(action: any, item: detailsPoll) {
    this.isInternalTask = true;
    this.selected = { action: action, pollItem: item };
    this.loadRiskEmployees();

    if (
      (this.actionForm.get('extraFields') as FormGroup).controls[
        'ohsRecommendation'
      ]
    ) {
      (this.actionForm.get('extraFields') as FormGroup).removeControl(
        'ohsRecommendation'
      );
    }

    this.taskTitle.nativeElement.innerText = `إنشاء مهمه ${action.name}`;
    this.task.nativeElement.click();
  }

  onSupportTaskCreate(action: any, item: detailsPoll) {
    this.isInternalTask = false;
    this.selected = { action: action, pollItem: item };
    if (
      !(this.actionForm.get('extraFields') as FormGroup).controls[
        'ohsRecommendation'
      ]
    ) {
      (this.actionForm.get('extraFields') as FormGroup).addControl(
        'ohsRecommendation',
        new FormControl(null, [Validators.required])
      );
    }

    this.loadSupportEmployee();
    this.taskTitle.nativeElement.innerText = `طلب دعم`;
    this.task.nativeElement.click();
  }

  onSubmit() {
    if (this.actionForm.valid) {
      let taskLevel;
      let danger =
        this.selected.pollItem.danger.con2 * this.selected.pollItem.danger.con1;
      if (danger > 12) {
        taskLevel = 4;
      } else if (danger <= 4) {
        taskLevel = 6;
      } else {
        taskLevel = 5;
      }

      let task = this.actionForm.value;
      task.tasksLevelId = taskLevel;
      task.tasksStatusId = 4;
      task.companyId = +this.companyId;
      task.notificationTypeId = this.isInternalTask ? 10 : 5;
      task.assignedToId = this.AssignedToId.value.id;
      task.creatorId = this.userId;
      task.managementid = this.localServices.DeptId;
      task.extraFields = JSON.stringify(task.extraFields);

      if (
        this.AssignedToId?.value?.userRoles[0]?.name == Roles[11] ||
        this.AssignedToId?.value?.userRoles[0]?.name == Roles[14] ||
        this.AssignedToId?.value?.userRoles[0]?.name == Roles[12]
      ) {
        task.managementId = this.AssignedToId?.value?.userDepartments[0].id;
      }

      if (this.AssignedToId.value?.userRoles[0]?.name == Roles[8]) {
        task.departementId = this.AssignedToId.value?.userDepartments[0]?.id;
      }

      if (this.AssignedToId.value?.userRoles[0]?.name == Roles[3]) {
        task.teamId = this.AssignedToId.value?.userDepartments[0]?.id;
      }

      if (!this.isInternalTask) {
        task.teamId = this.AssignedToId.value?.userDepartments[0]?.id;
      }

      let model = {
        name: this.selected.action?.name,
        pollItemId: this.selected.pollItem.item.id,
        priority: this.selected.pollItem.danger.con2,
        effect: this.selected.pollItem.danger.con1,
        taskLevelId: taskLevel,
        pollId: +this.pollId,
        tasks: task,
      };

      console.log(model);

      this.pollService.CreatePollItemAction(model).subscribe(
        () => {
          this.resetForm();
          Swal.fire({ icon: 'success', title: 'تم الإنشاء بنحاح' }).then(() => {
            this.close.nativeElement.click();
          });
        },
        (err) => {
          this.errorServices.handleError(err);
        }
      );
    }
  }

  resetForm() {
    this.form.resetForm();
  }
}
