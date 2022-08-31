import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Client } from 'src/app/admin/models/Client';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  clientList: Client[] = [];

  updates = new Subject<Client[]>();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  getAll() {
    this.http
      .get<Client[]>(environment.apiUrl + `Clients/GetAllClient`)
      .subscribe((resData) => {
        console.log(resData);

        this.clientList = resData;
        this.updates.next([...resData]);
      });
  }

  getById(id: number) {
    return this.http.get<Client>(
      environment.apiUrl + `Clients/GetClientById/${id}`
    );
  }

  add(client: Client) {
    this.http
      .post<Client>(environment.apiUrl + `Clients/CreateClient`, client)
      .subscribe(
        (resData) => {
          if (resData) {
            this.clientList.push(resData);
            this.updates.next([...this.clientList]);
            Swal.fire('Added!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error);
        }
      );
  }

  edit(id: number, question: Client) {
    this.http
      .post<Client>(
        environment.apiUrl + `Clients/UpdateClient?id=${id}`,
        question
      )
      .subscribe(
        (resData) => {
          const index = this.clientList.findIndex((q) => q.id == id);
          question.id = id;
          this.clientList[index] = resData;
          this.updates.next([...this.clientList]);
          Swal.fire('Updated!', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error);
        }
      );
  }

  delete(id: number) {
    this.http
      .post<boolean>(environment.apiUrl + `Clients/DeleteClient?id=${id}`, null)
      .subscribe((resData) => {
        if (resData) {
          let res = this.clientList.filter((q) => q.id != id);
          this.clientList = [...res];
          this.updates.next([...this.clientList]);
          Swal.fire('Deleted!', '', 'success');
        }
      });
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
