import { Component, OnInit, ViewChild } from '@angular/core';
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
import { User } from 'src/app/Auth/User';
import Swal from 'sweetalert2';
import { MangementServiceService } from './mangementService.service';

@Component({
  selector: 'app-Managements',
  templateUrl: './Managements.component.html',
  styleUrls: ['./Managements.component.css'],
})
export class ManagementsComponent implements OnInit {
  listMangement: Department[] = [];
  displayForm!: Boolean;
  displayFormUser!: Boolean;
  ManegementForm!: FormGroup;
  userForm: FormGroup;
  selected!: Department;
  userSelected: User;
  rolesAdmin: any[] = [];
  roles: any[] = [];
  @ViewChild(FormGroupDirective) form: FormGroupDirective;
  @ViewChild('formUser') formUser: FormGroupDirective;
  mangementRoles: any;
  constructor(
    private mangeService: MangementServiceService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.ManegementForm = this.fb.group({
      name: [null, Validators.required],
    });

    this.userForm = this.fb.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      roleName: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.mangeService.getAll();
    this.mangeService.getUpdates().subscribe((res) => {
      this.listMangement = [...res];
    });

    this.roles = [
      { id: '05b29ffd-7e7f-4d83-bf12-3d9bb859d452', name: 'OHS Employee' },
      {
        id: '524edbef-48fa-4dc5-80e8-3f834bca6351',
        name: 'OHS Department Manager',
      },
      { id: 'ecb2ded0-84a5-44d6-95a0-77cd551cd612', name: 'OHS Supervisor' },
    ];

    this.mangeService.getMangementTypeRole().subscribe((res) => {
      this.mangementRoles = res;
    });
    this.authService.user.subscribe((res) => {
      this.rolesAdmin = res.roles;
    });
  }

  public get Name(): FormControl {
    return this.ManegementForm.get('name') as FormControl;
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

  showForm(select: Department = null) {
    this.displayForm = true;
    this.selected = select;
    if (select) {
      this.ManegementForm.patchValue(this.selected);
    }
  }

  showFormUser(selected: Department) {
    this.displayFormUser = true;
    this.selected = selected;
  }
  onSubmit() {
    let model: Department = this.ManegementForm.value;
    if (!this.selected && this.ManegementForm.valid) {
      model.parentId = null;
      this.mangeService.add(model);
      this.displayForm = false;
      this.resetForm();
    } else {
      model.id = this.selected.id;
      model.parentId = null;
      model.correspondingDeptId = null;
      this.mangeService.edit(this.selected.id, model);
      this.displayForm = false;
      this.resetForm();
    }
  }

  onSubmit2() {
    let model = this.userForm.value;
    model.departementId = this.selected.id;
    model.subscriptionTypeId = 1;
    model.companyId = 1;
    console.log(model);
    this.mangeService.createUser(model);
    this.displayFormUser = false;
    this.resetForm2();
  }
  onDelete(id: number) {
    this.mangeService.delete(id);
  }

  resetForm() {
    this.form.resetForm();
    this.selected = null;
  }
  resetForm2() {
    this.formUser.resetForm();
    this.selected = null;
  }

  showDetails(id: number) {
    this.router.navigateByUrl('/admin/admin-panel/mangement/' + id);
  }
}
