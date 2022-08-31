import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Paging } from '../models/paging.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class CompanyAdminService {
  constructor(private http: HttpClient) {}

  getUsers(
    pageNumber: number,
    pageSize: number,
    order: number,
    sortBy: string,
    searchBy: string
  ) {
    return this.http.get<Paging<User[]>>(
      environment.apiUrl +
        `users/GetUsers?PageNumber=${pageNumber}&PageSize=${pageSize}&Order=${order}&SortBy='${sortBy}'&SearchBy=${searchBy}`
    );
  }

  updateUser(user: User) {
    return this.http.post(
      environment.apiUrl + `users/UpdateUser?id=${user.id}`,
      user
    );
  }

  createUser(user: User) {
    return this.http.post<User>(environment.apiUrl + `users/CreateUser`, user);
  }
  getRoles() {
    return this.http.get<Role[]>(environment.apiUrl + `Roles/GetRoles`);
  }
  createRole(roleName: string) {
    return this.http.post(environment.apiUrl + `Roles/CreateRole`, roleName);
  }
  editRole(role: Role) {
    return this.http.post(environment.apiUrl + `Roles/EditRole`, role);
  }
}
