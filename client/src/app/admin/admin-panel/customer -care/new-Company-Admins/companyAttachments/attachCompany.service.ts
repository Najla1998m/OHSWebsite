import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AttachCompanyService {
  listAttch: { attachments: any[]; id: any } = null;
  updated = new Subject<any>();
  constructor(private http: HttpClient) {}
  getAttachments(id: any) {
    return this.http
      .get(environment.apiUrl + `Tasks/GetAttachementTaskForUser?userId=${id}`)
      .subscribe((res: any) => {
        console.log(res, 'bewbew');

        this.listAttch = {
          attachments: res.subscriptionAttachments,
          id: res.id,
        };

        this.updated.next(this.listAttch);
      });
  }

  getRejectReasons() {
    return this.http.get(
      environment.apiUrl +
        `CancelSubscriptionReasons/GetAllCancelSubscriptionReasons`
    );
  }

  RejectAttachments(attach: any) {
    return this.http
      .post(
        environment.apiUrl +
          `SubscriptionTypeAttachment/DeleteSubscriptionTypeAttachmentList`,
        attach
      )
      .subscribe((res: any) => {
        this.listAttch.attachments = this.listAttch.attachments.filter(
          (a) => !attach.subscriptionTypeAttachmentList.includes(a.id)
        );
        this.updated.next(this.listAttch);
        Swal.fire('Sended', '', 'success');
      });
  }

  acceptUser(userId: any, isactiv: boolean) {
    return this.http
      .get(
        environment.apiUrl +
          `Users/ActivateUser?userId=${userId}&isVerified=${isactiv}`
      )
      .subscribe((res: any) => {
        this.listAttch.attachments = this.listAttch.attachments.filter(
          (a) => a.userId != userId
        );
        this.updated.next(this.listAttch);
        Swal.fire('Sended', '', 'success');
      });
  }
  getUpdates() {
    return this.updated.asObservable();
  }
}
