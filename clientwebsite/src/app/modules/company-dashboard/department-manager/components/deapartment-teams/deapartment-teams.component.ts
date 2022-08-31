import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import {
  AuthResponseData,
  AuthService,
} from 'src/app/modules/core/auth/auth.service';
import { MangmentService } from 'src/app/modules/core/services/mangment.service';
import { UserService } from 'src/app/modules/core/services/user.service';
import { UserDetails } from 'src/app/modules/shared/models/user-details';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-deapartment-teams',
  templateUrl: './deapartment-teams.component.html',
  styleUrls: ['./deapartment-teams.component.scss'],
})
export class DeapartmentTeamsComponent implements OnInit {
  totalCount!: number;
  pageNumber: number = 1;
  pageSize: number = 10;
  departmentId!: number;
  teams!: any[];
  user!: UserDetails;
  companyId!: number;
  teamForm!: FormGroup;

  @ViewChild('successM') success!: ElementRef;
  @ViewChild('modalForm') formClose!: ElementRef;
  @ViewChild('close') close!: ElementRef;
  @ViewChild(FormGroupDirective) form!: FormGroupDirective;

  constructor(
    private userService: UserService,
    private mangeService: MangmentService,
    private fb: FormBuilder,
    public navigationService: NavigationService
  ) {
    this.teamForm = this.fb.group({
      name: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.loadData();
  }

  paginate(event: number) {
    this.pageNumber = event;
  }

  get Name(): FormControl {
    return this.teamForm.get('name') as FormControl;
  }

  onSubmit() {
    if (this.teamForm.valid) {
      let model = this.teamForm.value;
      model.companyId = this.companyId;
      model.parentId = this.departmentId;
      this.mangeService.addTeam(model);
      this.close.nativeElement.click();
      this.form.resetForm();
    }
  }

  loadData() {
    this.userService.getUserDetails().subscribe((user) => {
      this.user = user;
      this.companyId = this.user.user.company.id;
      this.departmentId = this.user.user.userDepartments[0].id;

      this.mangeService.GetAllTeamsByCompanyIdAndDepartmentId(
        this.companyId,
        this.departmentId
      );
      this.mangeService.getTeamsUpdates().subscribe((data) => {
        this.teams = [...data];
        this.teams;
      });
    });
  }
}
