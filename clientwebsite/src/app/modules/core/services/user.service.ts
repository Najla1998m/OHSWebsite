import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AllUserDetails } from '../../shared/models/all-user-details';
import { UserDetails } from '../../shared/models/user-details';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly url = environment.apiUrl;

  private users: any[] = [];
  private updates = new Subject<any>();

  constructor(private http: HttpClient) {}

  getUser() {
    let id = localStorage.getItem('userId');
    return this.http.get<AllUserDetails>(this.url + `Users/GetUsersById/${id}`);
  }

  getUserById(id: string) {
    return this.http.get<AllUserDetails>(this.url + `Users/GetUsersById/${id}`);
  }

  getUserDetails() {
    let id = localStorage.getItem('userId');
    return this.http.get<UserDetails>(this.url + `Users/GetUserDetails/${id}`);
  }

  delegateAdmin(user: any) {
    return this.http.post<any>(
      this.url + 'Account/RegisterDelegatedAdmin',
      user
    );
  }

  getAllUserByDeptId(id: any) {
    this.http
      .get(
        environment.apiUrl +
          `Users/GetAllUsersByDepartementId?departementId=${id}`
      )
      .subscribe((data: any) => {
        this.users = [...data];
        this.updates.next([...data]);
      });
  }

  GetAllSupervisrosInCompany(CompanyId: number) {
    return this.http.get(
      this.url + `Users/GetAllSupervisrosInCompany?CompanyId=${CompanyId}`
    );
  }

  registerAnonymousUser(data: any) {
    return this.http.post(this.url + `Account/RegisterAnonymousUser`, data);
  }

  getUpdates() {
    return this.updates.asObservable();
  }

  updateUser(id: string, model: any) {
    return this.http.post(this.url + `Users/UpdateUserData?id=${id}`, model);
  }

  updateUserPhoto(model: any) {
    return this.http.post(this.url + `Users/UserPhoto`, model);
  }
}
