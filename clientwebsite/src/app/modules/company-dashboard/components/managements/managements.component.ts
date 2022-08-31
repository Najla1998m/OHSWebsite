import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthResponseData } from 'src/app/modules/core/auth/auth.service';
import { ErrorService } from 'src/app/modules/core/services/error.service';
import { MangmentService } from 'src/app/modules/core/services/mangment.service';
import { UserService } from 'src/app/modules/core/services/user.service';
import { Department } from 'src/app/modules/shared/models/department';
import { Roles } from 'src/app/modules/shared/models/roles';
import Swal from 'sweetalert2';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-managements',
  templateUrl: './managements.component.html',
  styleUrls: ['./managements.component.scss'],
})
export class ManagementsComponent implements OnInit {
  totalCount!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  companyId!: number;
  subscriptionTypeId!: number;
  formMang!: FormGroup;
  mangerForm!: FormGroup;
  listMangement: any[] = [];
  selectedDept!: Department;
  manager!: AuthResponseData;

  @ViewChild('mageModelClose') formClose!: ElementRef;
  @ViewChild('successM') succes!: ElementRef;
  @ViewChild(FormGroupDirective) deptform!: any;
  @ViewChild('addManager') addManger!: any;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private mangeService: MangmentService,
    private handelError: ErrorService,
    private cdref: ChangeDetectorRef,
    public navigationService: NavigationService
  ) {
    this.formMang = this.fb.group({
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      deptsNumber: [null, [Validators.required]],
    });

    /* ------------------------------- mangerForm ------------------------------- */
    this.mangerForm = this.fb.group({
      fullName: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
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
  }

  ngOnInit() {
    this.loadData();
  }

  public get Name(): FormControl {
    return this.formMang.get('name') as FormControl;
  }

  public get DeptNumber(): FormControl {
    return this.formMang.get('deptsNumber') as FormControl;
  }

  public get FName(): FormControl {
    return this.mangerForm.get('fullName') as FormControl;
  }

  public get Email(): FormControl {
    return this.mangerForm.get('email') as FormControl;
  }

  public get Phone(): FormControl {
    return this.mangerForm.get('phoneNumber') as FormControl;
  }

  onSubmit() {
    if (this.formMang.valid) {
      let mang = this.formMang.value;
      mang.companyId = this.companyId;
      console.log(mang);

      this.mangeService.addMangement(mang).subscribe(
        () => {
          this.mangeService.getAll(this.companyId);
          this.formClose.nativeElement.click();
          this.deptform?.resetForm();
          Swal.fire('تمت الاضافه بنجاح', '', 'success');
        },
        (error) => {
          this.handelError.handleError(error);
        }
      );
    }
  }

  onSubmit2() {
    if (this.mangerForm.valid) {
      let Manger = this.mangerForm.value;
      Manger.companyId = this.companyId;
      Manger.subscriptionTypeId = this.subscriptionTypeId;
      Manger.departementId = this.selectedDept.id;
      Manger.roleName = Roles[12];

      this.mangeService.addManger(Manger).subscribe((data) => {
        this.manager = data;
        this.succes.nativeElement.click();
        this.addManger.resetForm();
      });
    }
  }

  paginate(event: number) {
    this.pageNumber = event;
  }

  generateNumber() {
    return Math.floor(Math.random() * 100 + 1);
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  loadData() {
    this.userService.getUser().subscribe((data) => {
      this.companyId = data.companyId;
      this.subscriptionTypeId = data.subscriptionTypeId;
      this.mangeService.getAll(this.companyId);

      this.mangeService.getUpdates().subscribe((res) => {
        console.log(res);

        this.listMangement = [...res];
      });
    });
  }
}

function FormGroupDirective(FormGroupDirective: any) {
  throw new Error('Function not implemented.');
}
