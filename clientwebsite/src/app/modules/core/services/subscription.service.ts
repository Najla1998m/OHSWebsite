import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Attachment } from '../../shared/models/attachment';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private readonly url = environment.apiUrl;
  private subscription: Subscription[] = [];
  private updates!: Subject<Subscription[]>;

  constructor(private http: HttpClient, private errorServices: ErrorService) {
    this.updates = new Subject<Subscription[]>();
  }

  getAll() {
    this.http
      .get<Subscription[]>(this.url + `SubscriptionType/GetAllSubscriptionType`)
      .subscribe(
        (data) => {
          this.subscription = [...data];
          this.updates.next([...this.subscription]);
        },
        (err) => {
          this.errorServices.handleError(err);
        }
      );
  }

  getById(id: number) {
    return this.http.get<Subscription>(this.url);
  }

  getAttachmentBySubscriptionId(id: number) {
    return this.http.get<Attachment[]>(
      this.url +
        `SubscriptionTypeAttachment/GetAllAttachmentBySubscriptionTypeId?id=${id}`
    );
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
