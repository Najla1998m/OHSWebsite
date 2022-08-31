import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Clients } from '../../shared/models/clients';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private readonly url = environment.apiUrl;
  private clients: Clients[] = [];
  private updates!: BehaviorSubject<Clients[]>;

  constructor(private http: HttpClient, private errorServices: ErrorService) {
    this.updates = new BehaviorSubject<Clients[]>([]);
  }

  getAllClients() {
    this.http.get<Clients[]>(this.url + `Clients/GetAllClient`).subscribe(
      (data) => {
        this.clients = [...data];
        this.updates.next([...this.clients]);
        localStorage.setItem('clients', JSON.stringify(this.clients));
      },
      (err) => {
        this.errorServices.handleError(err);
      }
    );
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
