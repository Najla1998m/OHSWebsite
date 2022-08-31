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
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  totalCount!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  employeeForm!: FormGroup;
  employees: any[] = [];
  rolesMenu!: any[];
  deptsMenu!: any[];
  emp!: AuthResponseData;
  managementID!: any;

  @ViewChild('successM') success!: ElementRef;
  @ViewChild('modalForm') formClose!: ElementRef;
  @ViewChild(FormGroupDirective) form!: FormGroupDirective;

  constructor(
    private fb: FormBuilder,
    private userServ: UserService,
    private ar: ActivatedRoute,
    private localService: LocalStorageServiceService,
    private deptServ: MangmentService,
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
      departementId: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.loadInfo();
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

  public get Dept(): FormControl {
    return this.employeeForm.get('departementId') as FormControl;
  }

  paginate(event: number) {
    this.pageNumber = event;
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      let model = this.employeeForm.value;
      model.subscriptionTypeId = 1;
      model.companyId = this.localService.CompanyId;
      model.departementId = this.managementID;

      this.userServ.registerAnonymousUser(model).subscribe((data: any) => {
        this.emp = data;
        this.form.resetForm();
        this.success.nativeElement.click();
        this.userServ.getAllUserByDeptId(this.managementID);
      });
    }
  }

  getDeptName(id: number) {
    return this.deptsMenu.find((e) => e.id == id).name;
  }

  loadInfo() {
    this.ar.params.subscribe((url) => {
      let id = url.id;
      this.managementID = id;

      this.deptServ.getAllDepartementsByCompanyIdAndMangmentId(
        this.localService.CompanyId,
        this.managementID
      );

      this.deptServ.getUpdates().subscribe((data) => {
        this.deptsMenu = data;
      });

      // this.userServ.getAllUserByDeptId(id);
      // this.userServ.getUpdates().subscribe((data) => {
      //   this.employees = [...data];
      // });

      this.deptServ
        .GetEmployeeInDept(
          this.localService.UserId,
          this.localService.CompanyId
        )
        .subscribe((data: any) => {
          this.employees = [...data];
        });
    });

    this.roleService.getChildRoles().subscribe((data) => {
      this.rolesMenu = [...data];
    });
  }
}
