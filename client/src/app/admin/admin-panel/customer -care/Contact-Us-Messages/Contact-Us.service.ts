import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ContactUs } from 'src/app/admin/models/Contact-Us';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ContactUsService {
  private contactList: ContactUs[] = [];
  private updates = new Subject<ContactUs[]>();
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private toast: ToastrService) {}
  getAll() {
    this.http
      .get<ContactUs[]>(this.baseUrl + `ContactUs/GetContactUsMessage`)
      .subscribe((res) => {
        this.contactList = [...res];
        this.updates.next([...this.contactList]);
      });
  }

  getById(id: number) {
    return this.http.get(
      this.baseUrl + `ContactUs/GetContactUsMessageById?msgId=${id}`
    );
  }

  add(contact: ContactUs) {
    return this.http.post(
      this.baseUrl + `ContactUs/ReplyOnContactUsMsg`,
      contact
    );
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
