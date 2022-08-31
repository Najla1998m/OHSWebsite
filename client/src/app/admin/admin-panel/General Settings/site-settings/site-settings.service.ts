import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { SiteSettings } from 'src/app/admin/models/Site-Settings';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SiteSettingsService {
  siteSettings: SiteSettings[] = [];

  updates = new Subject<SiteSettings[]>();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  getAll() {
    this.http
      .get<SiteSettings[]>(environment.apiUrl + `Setting/GetAllSetting`)
      .subscribe((resData) => {
        this.siteSettings = resData;
        this.updates.next([...resData]);
      });
  }

  getById(id: number) {
    return this.http.get<SiteSettings>(
      environment.apiUrl + `Setting/GetSettingById/${id}`
    );
  }

  add(siteSetting: SiteSettings) {
    this.http
      .post<SiteSettings>(
        environment.apiUrl + `Setting/CreateSetting`,
        siteSetting
      )
      .subscribe(
        (resData) => {
          if (resData) {
            this.siteSettings.push(resData);
            this.updates.next([...this.siteSettings]);
            Swal.fire('Added!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error);
        }
      );
  }

  edit(id: number, question: SiteSettings) {
    this.http
      .post<boolean>(
        environment.apiUrl + `Setting/UpdateSetting?id=${id}`,
        question
      )
      .subscribe(
        (resData) => {
          const index = this.siteSettings.findIndex((q) => q.id == id);
          question.id = id;
          this.siteSettings[index] = question;
          this.updates.next([...this.siteSettings]);
          Swal.fire('Updated!', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error);
        }
      );
  }

  delete(id: number) {
    this.http
      .post<boolean>(
        environment.apiUrl + `Setting/DeleteSetting?id=${id}`,
        null
      )
      .subscribe((resData) => {
        if (resData) {
          let res = this.siteSettings.filter((q) => q.id != id);
          this.siteSettings = [...res];
          this.updates.next([...this.siteSettings]);
          Swal.fire('Deleted!', '', 'success');
        }
      });
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
