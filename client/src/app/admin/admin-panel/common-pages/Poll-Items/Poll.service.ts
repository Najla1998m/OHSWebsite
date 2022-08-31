import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ErrorHandlerService } from 'src/app/shared/services/errorHandler.service';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class PollService {
  listPollItems: any[] = [];
  updated = new Subject<any[]>();
  constructor(
    private http: HttpClient,
    private handeler: ErrorHandlerService
  ) {}

  getPollItems() {
    return this.http
      .get(environment.apiUrl + `PollItem/GetDefaultPollItems`)
      .subscribe(
        (res: any) => {
          this.listPollItems = [...res];
          this.updated.next([...this.listPollItems]);
        },
        (error: any) => {
          this.handeler.handleError(error.error);
        }
      );
  }

  addPollItem(data: any) {
    return this.http
      .post(environment.apiUrl + `PollItem/AddPollItem`, data)
      .subscribe(
        (res: any) => {
          this.listPollItems.push(res);
          this.updated.next([...this.listPollItems]);
          Swal.fire('Added!', '', 'success');
        },
        (error: any) => {
          this.handeler.handleError(error.error);
        }
      );
  }

  editPollItem(data: any) {
    return this.http
      .post(environment.apiUrl + `PollItem/UpdatePollItem`, data)
      .subscribe(
        (res) => {
          const index = this.listPollItems.findIndex((p) => p.id == data.id);
          this.listPollItems[index] = data;
          this.updated.next([...this.listPollItems]);
          Swal.fire('Updated!', '', 'success');
        },
        (error: any) => {
          this.handeler.handleError(error.error);
        }
      );
  }

  deletePollItem(id: any) {
    return this.http
      .post(
        environment.apiUrl + `PollItem/DeletePollItem?pollItemId=${id}`,
        null
      )
      .subscribe(
        (res) => {
          this.listPollItems = this.listPollItems.filter((p) => p.id != id);
          this.updated.next([...this.listPollItems]);
          Swal.fire('Deleted!', '', 'success');
        },
        (error: any) => {
          this.handeler.handleError(error.error);
        }
      );
  }

  getUpdates() {
    return this.updated.asObservable();
  }
}
