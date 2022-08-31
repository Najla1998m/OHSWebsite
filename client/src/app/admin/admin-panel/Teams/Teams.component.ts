import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Auth/Auth.service';
import Swal from 'sweetalert2';
import { Department } from '../../models/Department';
import { DepartmentService } from '../common-pages/department/department.service';
import { MangementServiceService } from '../common-pages/Managements/mangementService.service';
import { TeamsService } from './Teams.service';

@Component({
  selector: 'app-Teams',
  templateUrl: './Teams.component.html',
  styleUrls: ['./Teams.component.css'],
})
export class TeamsComponent implements OnInit {
  listTeams: Department[] = [];
  listDepts: Department[] = [];
  displayForm: boolean;
  teamsForm!: FormGroup;
  deptForm!: FormGroup;
  selected: Department;
  userForm: FormGroup;
  deptId!: number;
  @ViewChild('formAddTeam') formAddTeam: FormGroupDirective;
  @ViewChild('formUser') formUser: FormGroupDirective;
  roles: { id: string; name: string }[];
  rolesAdmin: any;
  teamRoles: any[] = [];
  displayFormUser: boolean;
  constructor(
    private teamsServic: TeamsService,
    private deptServic: DepartmentService,
    private mangeService: MangementServiceService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.deptForm = this.fb.group({
      parentId: [null],
    });

    this.teamsForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phoneNumber: [null, [Validators.required]],
      roleName: [null, [Validators.required]],
    });
    this.deptServic.getAll();
    this.deptServic.getUpdates().subscribe((res) => {
      this.listDepts = [...res];
      console.log(this.listDepts);
    });

    this.roles = [
      { id: '05b29ffd-7e7f-4d83-bf12-3d9bb859d452', name: 'OHS Employee' },
      {
        id: '524edbef-48fa-4dc5-80e8-3f834bca6351',
        name: 'OHS Department Manager',
      },
      { id: 'ecb2ded0-84a5-44d6-95a0-77cd551cd612', name: 'OHS Supervisor' },
    ];

    this.teamsServic.getTeamTypeRole().subscribe((res: any) => {
      this.teamRoles = [...res];
      console.log(this.teamRoles, 'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
    });
    this.authService.user.subscribe((res) => {
      this.rolesAdmin = res.roles;
    });
  }
  public get Department(): FormControl {
    return this.deptForm.get('parentId') as FormControl;
  }

  public get Name(): FormControl {
    return this.teamsForm.get('name') as FormControl;
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

  load() {
    console.log(this.Department.value);

    this.teamsServic.getAllTeams(this.Department.value);
    this.teamsServic.getUpdates().subscribe((res) => {
      this.listTeams = [...res];
      console.log(this.listTeams);
    });
  }

  showForm(selected: Department) {
    this.displayForm = true;
    this.selected = selected;
    if (selected) {
      this.teamsForm.patchValue(selected);
    }
  }

  showFormUser(selected: Department) {
    this.displayFormUser = true;
    this.selected = selected;
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
    this.teamsServic.deleteTeam(id);
  }
  resetForm() {
    this.formAddTeam.resetForm();
    this.selected = null;
  }
  getSelected(id: any) {
    return this.listDepts.find((e) => e.id == id).name;
  }

  onSubmit() {
    if (!this.selected && this.teamsForm.value) {
      let teamModel = this.teamsForm.value;
      teamModel.parentId = this.Department.value;
      teamModel.companyId = 1;

      this.teamsServic.addTeam(teamModel);
    } else if (this.selected && this.teamsForm.value) {
      let teamEditModel = this.teamsForm.value;
      teamEditModel.companyId = 1;
      teamEditModel.parentId = this.Department.value;
      this.teamsServic.editTeam(this.selected.id, teamEditModel);
    }
    this.displayForm = false;
    this.resetForm();
  }

  resetForm2() {
    this.formUser.resetForm();
    this.selected = null;
  }

  showDetails(id: any) {
    this.router.navigateByUrl('/admin/admin-panel/teams/' + id);
  }
}
