import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Subject } from 'rxjs';
import { FormFields } from 'src/app/admin/models/formFields';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class FormFieldsService {
  listFormFields: FormFields[] = [];
  private updates = new Subject<FormFields[]>();
  constructor(private http: HttpClient, private toast: ToastrService) {}
  getAllFormFields() {
    this.http
      .get(environment.apiUrl + `FormItem/GetAllFormItems`)
      .subscribe((res: any) => {
        this.listFormFields = [...res];
        this.updates.next([...this.listFormFields]);
      });
  }

  getFormFieldById(id: number) {
    return this.http.get(
      environment.apiUrl + `FormItem/GetFormItemById?formItemId=${id}`
    );
  }

  createFormField(form: FormFields) {
    this.http
      .post(environment.apiUrl + `FormItem/CreateFormItem`, form)
      .subscribe(
        (res: any) => {
          if (res) {
            this.listFormFields.push(res);
            this.updates.next([...this.listFormFields]);
            Swal.fire('Added', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  updateFormField(form: FormFields) {
    this.http
      .post(environment.apiUrl + `FormItem/UpdateFormItem`, form)
      .subscribe(
        (res: any) => {
          const index = this.listFormFields.findIndex((f) => f.id == form.id);
          this.listFormFields[index] = form;
          this.updates.next([...this.listFormFields]);
          Swal.fire('Updated', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  deleteFormField(id: any) {
    this.http
      .post(environment.apiUrl + `FormItem/DeleteFormItem?id=${id}`, null)
      .subscribe(
        (res) => {
          this.listFormFields = this.listFormFields.filter((f) => f.id != id);
          this.updates.next([...this.listFormFields]);
          Swal.fire('Deleted!', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
