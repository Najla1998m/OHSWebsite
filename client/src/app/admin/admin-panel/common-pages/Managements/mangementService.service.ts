import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Department } from 'src/app/admin/models/Department';
import { User } from 'src/app/admin/models/user.model';
import { ErrorHandlerService } from 'src/app/shared/services/errorHandler.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MangementServiceService {
  private baseUrl = environment.apiUrl;
  listMangments: Department[] = [];
  listUser: User[] = [];
  private updateUser = new Subject<User[]>();
  private updated = new Subject<Department[]>();
  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private handler: ErrorHandlerService
  ) {}
  getAll() {
    this.http
      .get<Department[]>(
        this.baseUrl + `Departement/GetAllManagementsByCompanyId?CompanyId=1`
      )
      .subscribe(
        (res) => {
          this.listMangments = [...res];
          this.updated.next([...this.listMangments]);
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  add(mange: Department) {
    mange.companyId = 1;
    this.http
      .post<Department>(this.baseUrl + `Departement/AddManagement`, mange)
      .subscribe(
        (res) => {
          if (res) {
            this.listMangments.push(res);
            this.updated.next([...this.listMangments]);
            Swal.fire('Added!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  edit(id: number, mange: Department) {
    mange.companyId = 1;
    this.http
      .post<Department>(
        this.baseUrl + `Departement/UpdateManagment?id=${id}`,
        mange
      )
      .subscribe(
        (res) => {
          if (res) {
            const index = this.listMangments.findIndex((m) => m.id == id);
            mange.id = id;
            this.listMangments[index] = mange;
            this.updated.next([...this.listMangments]);
            Swal.fire('updated', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  delete(id: number) {
    this.http
      .post<boolean>(
        this.baseUrl + `Departement/DeleteDepartement?id=${id}`,
        null
      )
      .subscribe(
        (res) => {
          if (res) {
            this.listMangments = this.listMangments.filter((m) => m.id != id);
            this.updated.next([...this.listMangments]);
            Swal.fire('Deleted!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  createUser(user: User) {
    this.http
      .post<User>(environment.apiUrl + `Account/RegisterAnonymousUser`, user)
      .subscribe(
        (res) => {
          this.listUser.push(res);
          this.updateUser.next([...this.listUser]);
          Swal.fire('Added!', '', 'success');
        },
        (error: any) => {
          console.log(error);

          this.handler.handleError(error.error.text);
        }
      );
  }
  getUpdates() {
    return this.updated.asObservable();
  }

  getMangementTypeRole() {
    return this.http.get(
      environment.apiUrl +
        `DepartmentTypeRole/GetRolesForDeptType?deptType=Management`
    );
  }

  getUsersInMangement(id: number) {
    return this.http.get(
      environment.apiUrl + `Users/GetAllUsersByMangementId?MangementId=${id}`
    );
  }

  deleteUser(id: any) {
    return this.http.post(
      environment.apiUrl + `Users/DeleteUser?id=${id}`,
      null
    );
  }
}
