import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { RejectReason } from 'src/app/admin/models/Reject-reason';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class RejectReasonsServiceService {
  private reasonsList: RejectReason[] = [];
  private updates = new Subject<RejectReason[]>();
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private toast: ToastrService) {}

  getAll() {
    this.http
      .get<RejectReason[]>(
        this.baseUrl +
          `CancelSubscriptionReasons/GetAllCancelSubscriptionReasons`
      )
      .subscribe((res) => {
        this.reasonsList = [...res];
        this.updates.next([...this.reasonsList]);
      });
  }

  getById(id: number) {
    return this.http.get<RejectReason>(
      this.baseUrl +
        `CancelSubscriptionReasons/GetCancelSubscriptionReason/:id=${id}`
    );
  }

  add(reason: RejectReason) {
    this.http
      .post<RejectReason>(
        this.baseUrl +
          `CancelSubscriptionReasons/CreateCancelSubscriptionReason`,
        reason
      )
      .subscribe(
        (res) => {
          if (res) {
            this.reasonsList.push(res);
            this.updates.next([...this.reasonsList]);
            Swal.fire('Added!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  edit(id: number, reason: RejectReason) {
    this.http
      .post<RejectReason>(
        this.baseUrl +
          `CancelSubscriptionReasons/UpdateCancelSubscriptionReason?id=${id}`,
        reason
      )
      .subscribe(
        (res) => {
          const index = this.reasonsList.findIndex((r) => r.id == id);
          reason.id = id;
          this.reasonsList[index] = reason;
          this.updates.next([...this.reasonsList]);
          Swal.fire('updated', '', 'success');
        },
        (errror: HttpErrorResponse) => {
          this.toast.error(errror.error);
        }
      );
  }

  delete(id: number) {
    this.http
      .post<boolean>(
        this.baseUrl +
          `CancelSubscriptionReasons/DeleteCancelSubscriptionReason?id=${id}`,
        null
      )
      .subscribe((res) => {
        if (res) {
          this.reasonsList = this.reasonsList.filter((r) => r.id != id);
          this.updates.next([...this.reasonsList]);
          Swal.fire('Deleted!', '', 'success');
        }
      });
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
