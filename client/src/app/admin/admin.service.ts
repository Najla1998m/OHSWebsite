import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { exhaustMap, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { AuthService } from '../Auth/Auth.service';
import { Paging } from './models/paging.model';
import { Role } from './models/role.model';
import { User } from './models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(
    private http: HttpClient,
    private toast: ToastrService,
    private authService: AuthService
  ) {}

  getUsers() {
    return this.http.get<Paging<User[]>>(
      environment.apiUrl + `Users/GetAllUserInCompany?CompanyId=${1}`
    );
  }

  updateUser(user: User) {
    return this.http.post(
      environment.apiUrl + `users/UpdateUser?id=${user.id}`,
      user
    );
  }

  createUser(user: User) {
    return this.http.post<User>(
      environment.apiUrl + `Account/RegisterAnonymousUser`,
      user
    );
  }
  deleteUser(userId: string) {
    return this.http.post(
      environment.apiUrl + `users/DeleteUser?id=${userId}`,
      null
    );
  }
  deleteUsers(usersIds: string[]) {
    return this.http.post(environment.apiUrl + `users/DeleteUsers`, usersIds);
  }
  getRoles() {
    return this.http.get<Role[]>(environment.apiUrl + `Roles/GetRoles`);
  }
  getParentRoles() {
    return this.http.get<Role[]>(environment.apiUrl + `Roles/GetParentRoles`);
  }

  getChildRoles() {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.get<Role[]>(
          environment.apiUrl + `Roles/GetChildRoles?userId=${user.getUserId()}`
        );
      })
    );
  }
  createRole(role: Role) {
    return this.http.post<Role>(environment.apiUrl + `Roles/CreateRole`, role);
  }
  updateRole(role: Role) {
    return this.http.post<Role>(environment.apiUrl + `Roles/EditRole`, role);
  }
  deleteRole(role: Role) {
    return this.http.post(environment.apiUrl + `Roles/DeleteRole`, role);
  }
  getDepartments() {
    return this.http.get<any[]>(
      environment.apiUrl +
        `Departement/GetAllDepartementsByCompanyId?CompanyId=1`
    );
  }
  getImageInBase64(file: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  getUserByDeptId(deptId: any) {
    return this.http.get<any[]>(
      environment.apiUrl +
        `Users/GetAllUsersByDepartementId?departmentId=${deptId}`
    );
  }

  userIsManger(id: number, isManager: boolean) {
    return this.http.post(
      environment.apiUrl +
        `Account/SetUserAsTeamManger?userId=${id}&isManager=${isManager}`,
      isManager
    );
  }

  getUserDepts(userId: any) {
    return this.http.get(environment.apiUrl + `Users/GetUserDetails/${userId}`);
  }
  addUserInDept(departementId: number, userId: any) {
    return this.http.post(
      environment.apiUrl +
        `Users/AddDepartementToUserByDepartementId?departementId=${departementId}&userId=${userId}`,
      null
    );
  }
}
