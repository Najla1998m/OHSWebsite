import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/admin/admin.service';
import { Department } from 'src/app/admin/models/Department';
import { User } from 'src/app/Auth/User';
import Swal from 'sweetalert2';
import { MangementServiceService } from '../../Managements/mangementService.service';
import { DepartmentService } from '../department.service';

@Component({
  selector: 'app-department-details',
  templateUrl: './department-details.component.html',
  styleUrls: ['./department-details.component.css'],
})
export class DepartmentDetailsComponent implements OnInit {
  department!: Department;
  employees!: any[];
  selectedEmployees!: [];
  loading: boolean = true;
  users!: any[];
  id: number;
  constructor(
    private ar: ActivatedRoute,
    private deptServ: DepartmentService,
    private toastr: ToastrService,
    private adminservices: AdminService,
    private mangeService: MangementServiceService
  ) {}

  ngOnInit() {
    this.ar.params.subscribe(
      (url) => {
        this.id = url.id;
        this.deptServ.getById(this.id).subscribe((dept) => {
          this.department = dept;
          this.users = [...dept.userDepartments];
        });
      },
      (error: HttpErrorResponse) => {
        this.toastr.error('An Error Occurred');
      }
    );

    this.deptServ.getUsersInDepts(this.id).subscribe((res: any) => {
      this.employees = res;
    });
  }

  onDelete(id: any) {
    this.mangeService.deleteUser(id).subscribe((res) => {
      Swal.fire('Deleted!', '', 'success').then((r) => {
        this.deptServ.getUsersInDepts(this.id).subscribe((res: any) => {
          this.employees = res;
        });
      });
    });
  }
}
