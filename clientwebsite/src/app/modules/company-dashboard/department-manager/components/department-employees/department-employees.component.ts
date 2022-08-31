import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthResponseData } from 'src/app/modules/core/auth/auth.service';
import { LocalStorageServiceService } from 'src/app/modules/core/services/local-storage-service.service';
import { MangmentService } from 'src/app/modules/core/services/mangment.service';
import { RolesService } from 'src/app/modules/core/services/roles.service';
import { UserService } from 'src/app/modules/core/services/user.service';
import { UserDetails } from 'src/app/modules/shared/models/user-details';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-department-employees',
  templateUrl: './department-employees.component.html',
  styleUrls: ['./department-employees.component.scss'],
})
export class DepartmentEmployeesComponent implements OnInit {
  totalCount!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  departmentId!: number;
  employees!: any[];
  employeeForm!: FormGroup;
  rolesMenu!: any[];
  emp!: AuthResponseData;

  @ViewChild('successM') success!: ElementRef;
  @ViewChild('modalForm') formClose!: ElementRef;
  @ViewChild(FormGroupDirective) form!: FormGroupDirective;

  constructor(
    private usersService: UserService,
    private ar: ActivatedRoute,
    private fb: FormBuilder,
    private localService: LocalStorageServiceService,
    private roleService: RolesService,
    public navigationService: NavigationService
  ) {
    this.employeeForm = this.fb.group({
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
      roleName: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  public get Email(): FormControl {
    return this.employeeForm.get('email') as FormControl;
  }

  public get Phone(): FormControl {
    return this.employeeForm.get('phoneNumber') as FormControl;
  }

  public get Name(): FormControl {
    return this.employeeForm.get('fullName') as FormControl;
  }

  public get RoleName(): FormControl {
    return this.employeeForm.get('roleName') as FormControl;
  }

  paginate(event: number) {
    this.pageNumber = event;
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      let model = this.employeeForm.value;
      model.subscriptionTypeId = 1;
      model.companyId = this.localService.CompanyId;
      model.departementId = this.departmentId;

      this.usersService.registerAnonymousUser(model).subscribe((data: any) => {
        this.emp = data;
        this.form.resetForm();
        this.success.nativeElement.click();
        this.usersService.getAllUserByDeptId(this.departmentId);
      });
    }
  }

  loadData() {
    this.ar.params.subscribe((url) => {
      this.departmentId = url.deptId;

      this.usersService.getAllUserByDeptId(this.departmentId);
      this.usersService.getUpdates().subscribe((data) => {
        this.employees = [...data];
        this.employees;
      });
    });

    this.roleService.getChildRoles().subscribe((data) => {
      console.log(data);

      this.rolesMenu = [...data];
    });
  }
}
