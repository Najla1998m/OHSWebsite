import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Department } from 'src/app/admin/models/Department';
import { AuthService } from 'src/app/Auth/Auth.service';
import Swal from 'sweetalert2';
import { MangementServiceService } from '../../Managements/mangementService.service';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
})
export class DepartmentComponent implements OnInit {
  departments!: Department[];
  departmentForm!: FormGroup;
  userForm: FormGroup;
  mangmentsList: Department[] = [];
  displayForm!: boolean;
  selected!: Department;
  displayFormUser!: Boolean;
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  @ViewChild('close') closeBtn: ElementRef;
  @ViewChild('formUser') formUser: FormGroupDirective;
  roles: { id: string; name: string }[];
  rolesAdmin: any[];
  deptRoles: any;
  constructor(
    private deptServ: DepartmentService,
    private mangService: MangementServiceService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.departmentForm = this.fb.group({
      name: [null, Validators.required],
      parentId: [null],
    });
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      roleName: [null, [Validators.required]],
    });

    this.roles = [
      { id: '05b29ffd-7e7f-4d83-bf12-3d9bb859d452', name: 'OHS Employee' },
      {
        id: '524edbef-48fa-4dc5-80e8-3f834bca6351',
        name: 'OHS Department Manager',
      },
      {
        id: 'ecb2ded0-84a5-44d6-95a0-77cd551cd612',
        name: 'OHS Supervisor',
      },
    ];

    this.deptServ.getAll();
    this.mangService.getAll();
    this.mangService.getUpdates().subscribe((res) => {
      this.mangmentsList = [...res];
    });
    this.deptServ.getUpdates().subscribe((data) => {
      this.departments = [...data];
      console.log(this.departments);
    });

    this.deptServ.getDepartmentTypeRole().subscribe((res) => {
      this.deptRoles = res;
    });
    this.authService.user.subscribe((res) => {
      this.rolesAdmin = res.roles;
    });
  }

  public get UserName(): FormControl {
    return this.userForm.get('fullName') as FormControl;
  }
  public get Email(): FormControl {
    return this.userForm.get('email') as FormControl;
  }
  public get PhoneNumber(): FormControl {
    return this.userForm.get('phoneNumber') as FormControl;
  }

  public get Name(): FormControl {
    return this.departmentForm.get('name') as FormControl;
  }

  public get Mangement(): FormControl {
    return this.departmentForm.get('parentId') as FormControl;
  }

  showForm(selected: any = null) {
    this.displayForm = true;
    this.selected = selected;
    if (selected) {
      console.log(selected);
      this.Mangement.setValue(selected?.parentId);
      this.departmentForm.patchValue(selected);
    }
  }

  onSubmit() {
    if (!this.selected && this.departmentForm.valid) {
      let model: Department = this.departmentForm.value;
      model.userDepartments = [];
      model.parentId = this.Mangement.value.id;
      model.correspondingDeptId = null;

      this.deptServ.add(model);
      this.displayForm = false;
    } else if (this.selected && this.departmentForm.valid) {
      let model = this.departmentForm.value;
      model.userDepartments = this.selected.userDepartments;
      model.id = this.selected.id;
      model.parentId = this.Mangement.value.id;
      model.correspondingDeptId = null;
      this.deptServ.edit(this.selected.id, model);
      this.displayForm = false;
    }
  }

  onSubmit2() {
    let model = this.userForm.value;
    model.departementId = this.selected.id;
    model.subscriptionTypeId = 1;
    model.companyId = 1;
    console.log(model);
    this.mangService.createUser(model);
    this.displayFormUser = false;
    this.resetForm2();
  }

  onDelete(id: number) {
    this.deptServ.delete(id);
  }

  showDetails(id: number) {
    this.router.navigateByUrl('/admin/admin-panel/department/' + id);
  }

  showFormUser(selected: Department) {
    this.displayFormUser = true;
    this.selected = selected;
  }
  resetForm() {
    this.form.resetForm();
    this.selected = null;
  }
  resetForm2() {
    this.formUser.resetForm();
    this.selected = null;
  }
}
