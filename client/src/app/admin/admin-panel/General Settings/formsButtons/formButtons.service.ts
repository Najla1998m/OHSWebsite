import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { FormButton } from 'src/app/admin/models/formButton';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class FormButtonsService {
  listFormBtns: FormButton[] = [];
  updated = new Subject<FormButton[]>();
  constructor(private http: HttpClient, private toast: ToastrService) {}

  GetAllDepartementsByCompanyId() {
    return this.http.get(
      environment.apiUrl +
        `Departement/GetAllDepartementsByCompanyId?CompanyId=1`
    );
  }
  //Setting/GetSettingBySettingType?settingType=FormButton
  getAllFormsBtns() {
    this.http
      .get(
        environment.apiUrl +
          `Setting/GetSettingBySettingType?settingType=FormButton`
      )
      .subscribe((res: any) => {
        this.listFormBtns = [...res];
        this.updated.next([...this.listFormBtns]);
      });
  }

  CreateSetting(formBtns: any) {
    return (
      this.http
        .post(environment.apiUrl + `Setting/CreateSetting`, formBtns)
        .subscribe((res: any) => {
          this.listFormBtns.push(res);
          this.updated.next([...this.listFormBtns]);
          Swal.fire('Added', '', 'success');
        }),
      (error: HttpErrorResponse) => {
        this.toast.error(error.error);
      }
    );
  }

  updateSetting(id: any, form: any) {
    return this.http
      .post(environment.apiUrl + `Setting/UpdateSetting?id=${id}`, form)
      .subscribe(
        (res: any) => {
          const index = this.listFormBtns.findIndex((r) => r.id == id);
          this.listFormBtns[index] = form;
          this.updated.next([...this.listFormBtns]);
          Swal.fire('Updated', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  getUpdatesFormBtns() {
    return this.updated.asObservable();
  }

  GetAllForms() {
    return this.http.get(environment.apiUrl + `Form/GetAllForms`);
  }

  delete(id: number) {
    this.http
      .post(environment.apiUrl + `Setting/DeleteSetting?id=${id}`, null)
      .subscribe(
        (res: any) => {
          this.listFormBtns = this.listFormBtns.filter((r) => r.id != id);
          this.updated.next([...this.listFormBtns]);
          Swal.fire('Deleted', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }
}
