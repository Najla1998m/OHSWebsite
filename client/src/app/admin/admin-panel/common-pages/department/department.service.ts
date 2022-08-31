import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Subject } from 'rxjs';
import { Department } from 'src/app/admin/models/Department';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  departments: Department[] = [];
  update = new Subject<Department[]>();
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getAll() {
    this.http
      .get<Department[]>(
        environment.apiUrl +
          `Departement/GetAllDepartementsByCompanyId?CompanyId=1`
      )
      .subscribe((resData) => {
        console.log(resData);

        this.departments = resData;
        this.update.next([...resData]);
      });
  }

  getById(id: number) {
    return this.http.get<Department>(
      environment.apiUrl + `Departement/GetDepartementById/${id}`
    );
  }

  add(department: Department) {
    department.companyId = 1;

    this.http
      .post<Department>(
        environment.apiUrl + `Departement/AddDepartement`,
        department
      )
      .subscribe(
        (resData) => {
          if (resData) {
            this.departments.push(resData);
            this.update.next([...this.departments]);
            Swal.fire('Added!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error);
        }
      );
  }

  edit(id: number, dept: Department) {
    dept.companyId = 1;
    dept.correspondingDeptId = null;
    console.log(dept);

    this.http
      .post<boolean>(
        environment.apiUrl + `Departement/UpdateSubDepartement?id=${id}`,
        dept
      )
      .subscribe(
        (resData) => {
          const index = this.departments.findIndex((q) => q.id == id);
          dept.id = id;
          this.departments[index] = dept;
          this.update.next([...this.departments]);
          Swal.fire('Updated!', '', 'success');
        },
        (error: HttpErrorResponse) => {
          // ;
          this.toastr.error(error.error);
        }
      );
  }

  delete(id: number) {
    this.http
      .post<boolean>(
        environment.apiUrl + `Departement/DeleteDepartement?id=${id}`,
        null
      )
      .subscribe((resData) => {
        if (resData) {
          let res = this.departments.filter((q) => q.id != id);
          this.departments = [...res];
          this.update.next([...this.departments]);
          Swal.fire('Deleted!', '', 'success');
        }
      });
  }

  getUpdates() {
    return this.update.asObservable();
  }

  getDepartmentTypeRole() {
    return this.http.get(
      environment.apiUrl +
        `DepartmentTypeRole/GetRolesForDeptType?deptType=Department`
    );
  }

  getUsersInDepts(id: number) {
    return this.http.get(
      environment.apiUrl +
        `Users/GetAllUsersByDepartementId?departementId=${id}`
    );
  }
}
