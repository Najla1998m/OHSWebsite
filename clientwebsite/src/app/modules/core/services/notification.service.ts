import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  Notification,
  NotificationsResponse,
} from '../../shared/models/notification';
import { LocalStorageServiceService } from './local-storage-service.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly url = environment.apiUrl;
  private notifications!: NotificationsResponse;
  private updates = new Subject<NotificationsResponse>();

  constructor(
    private http: HttpClient,
    private localService: LocalStorageServiceService
  ) {}

  GetNotificationsByUserId(id: string) {
    this.http
      .get<NotificationsResponse>(
        this.url + `Notification/GetNotificationsByUserId?UserId=${id}`
      )
      .pipe(
        map((data) => {
          data.notifications = data.notifications.map((e) => {
            if (e.tasks) {
              e.tasks.extraFields = JSON.parse(e.tasks.extraFields);
            }

            return e;
          });

          return data;
        })
      )
      .subscribe((data: any) => {
        console.log('data', data);

        this.notifications = data;
        this.updates.next(this.notifications);
      });
  }

  onNotificationSeen(notify: Notification) {
    notify.isRead = true;

    this.http
      .post(
        this.url +
          `Notification/UpdateNotificationToRead?notificationId=${notify.id}`,
        notify
      )
      .subscribe(
        (data) => {
          const index = this.notifications.notifications.findIndex(
            (e) => e.id == notify.id
          );
          this.notifications.notifications[index] = notify;
          this.notifications.readedCount++;
          this.notifications.unReadedCount--;
          this.updates.next(this.notifications);
        },
        () => {
          notify.isRead = false;
          const index = this.notifications.notifications.findIndex(
            (e) => e.id == notify.id
          );
          this.notifications.notifications[index] = notify;
          this.notifications.readedCount--;
          this.notifications.unReadedCount++;
          this.updates.next(this.notifications);
        }
      );
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
