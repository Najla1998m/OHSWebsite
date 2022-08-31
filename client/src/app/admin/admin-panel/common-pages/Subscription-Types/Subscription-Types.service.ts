import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Subscription,
  subscriptionTypeDto,
} from 'src/app/admin/models/subscriptionType';
import { SubscriptionTypesTermDto } from 'src/app/admin/models/SubscriptionTypesTerm';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionTypesService {
  basUrl = environment.apiUrl;
  listSubscription: Subscription[] = [];
  listTerms: SubscriptionTypesTermDto[] = [];
  private updated = new Subject<Subscription[]>();
  private update = new Subject<SubscriptionTypesTermDto[]>();
  constructor(private http: HttpClient, private toast: ToastrService) {}
  getAllSubscriptionType() {
    this.http
      .get<Subscription[]>(
        this.basUrl + `SubscriptionType/GetAllSubscriptionType`
      )
      .subscribe((res) => {
        this.listSubscription = [...res];
        this.updated.next([...this.listSubscription]);
      });
  }
  //SubscriptionTypesTerm/GetTermsBySubscriptionTypeId/:id
  getTermsById(id: number) {
    return this.http.get(
      this.basUrl + `SubscriptionTypesTerm/GetTermsBySubscriptionTypeId/${id}`
    );
  }
  updateAttachment(id: number, attch: SubscriptionTypesTermDto) {
    this.http
      .post(
        this.basUrl +
          `SubscriptionTypeAttachment/UpdateSubscriptionTypeAttachment?id=${id}`,
        attch
      )
      .subscribe(
        (res: any) => {
          console.log(res);

          Swal.fire('updated', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  //SubscriptionTypesTerm/UpdateSubscriptionTypesTerms?id=1
  updateTerms(id: number, term: SubscriptionTypesTermDto) {
    this.http
      .post(
        this.basUrl +
          `SubscriptionTypesTerm/UpdateSubscriptionTypesTerms?id=${id}`,
        term
      )
      .subscribe(
        (res: any) => {
          console.log(res);

          Swal.fire('updated', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  createAttachment(attach: SubscriptionTypesTermDto) {
    this.http
      .post(
        this.basUrl + `SubscriptionTypesTerm/CreateSubscriptionTypesTerms`,
        attach
      )
      .subscribe(
        (res: any) => {
          if (res) {
            this.listTerms.push(res);
            this.update.next([...this.listTerms]);
            console.log(this.listTerms, 'term');

            Swal.fire('Added!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  getUpdates() {
    return this.updated.asObservable();
  }

  getupdteTerms() {
    return this.update.asObservable();
  }

  getAttachmentBySupId(id: number) {
    return this.http.get(
      this.basUrl +
        `SubscriptionTypeAttachment/GetAllAttachmentBySubscriptionTypeId?id=${id}`
    );
  }

  addAttachment(attach: any) {
    return this.http.post(
      this.basUrl + `Attachment/CreateSubscriptionTypeAttachement`,
      attach
    );
  }

  editAttachment(attach: any, id: number) {
    return this.http.post(
      this.basUrl + `Attachment/UpdateAttachment?id=${id}`,
      attach
    );
  }

  deleteAttach(id: number) {
    return this.http.post(
      this.basUrl + `Attachment/DeleteAttachment?id=${id}`,
      null
    );
  }
}
