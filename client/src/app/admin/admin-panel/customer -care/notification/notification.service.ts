import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { BehaviorSubject, Subject } from 'rxjs';
import { Notification } from 'src/app/admin/models/notification';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  notificationList: Notification[] = [];
  private updated = new BehaviorSubject<Notification[]>([]);
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private toast: ToastrService) {}

  getAll(userId: any) {
    this.http
      .get<Notification[]>(
        this.baseUrl + `Notification/GetNotificationsByUserId?UserId=${userId}`
      )
      .subscribe((res) => {
        this.notificationList = [...res];
        this.updated.next([...this.notificationList]);
      });
  }

  getById(id: number) {
    return this.http.get<Notification>(
      this.baseUrl + `Notification/GetNotificationById/${id}`
    );
  }

  delete(id: number) {
    this.http
      .post<boolean>(
        this.baseUrl + `Notification/DeleteNotification?id=${id}`,
        null
      )
      .subscribe((res) => {
        if (res) {
          this.notificationList = this.notificationList.filter(
            (n) => n.id != id
          );
          this.updated.next([...this.notificationList]);
          Swal.fire('Deleted!', '', 'success');
        }
      });
  }

  getAllUserInCompany(userId:any) {
    return this.http.get(
      environment.apiUrl +
        `Users/GetEmployeeInDept?userId=${userId}&companyId=${1}`
    );
  }

  getStatusTasks() {
    return this.http.get(
      environment.apiUrl + `TasksStatusStatus/GetAllTasksStatus`
    );
  }

  updateTask(id: any, data: any) {
    return this.http
      .post(environment.apiUrl + `Tasks/UpdateTasks?id=${id}`, data)
      .subscribe((res: any) => {
        Swal.fire('Updated!', '', 'success');
      });
  }
  getUpdate() {
    return this.updated.asObservable();
  }
}
