import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Subject } from 'rxjs';
import { FormFileType } from 'src/app/admin/models/formFileType';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class FormFiledTypeService {
  listFiledTypes: FormFileType[] = [];
  private updated = new Subject<FormFileType[]>();
  constructor(private http: HttpClient, private toast: ToastrService) {}

  getAllFormsTypes() {
    this.http
      .get(environment.apiUrl + `FormItemType/GetAllFormItemTypes`)
      .subscribe((res: any) => {
        this.listFiledTypes = [...res];
        this.updated.next([...this.listFiledTypes]);
      });
  }

  getFormFiledTypeById(id: number) {
    return this.http.get(
      environment.apiUrl +
        `FormItemType/GetFormItemTypeById?formItemTypeId=${id}`
    );
  }

  getAllValidators() {
    return this.http.get(
      environment.apiUrl +
        `Setting/GetSettingBySettingType?settingType=AngularValidator`
    );
  }

  createFormFiledType(form: FormFileType) {
    this.http
      .post(environment.apiUrl + `FormItemType/CreateFormItemType`, form)
      .subscribe(
        (res: any) => {
          if (res) {
            this.listFiledTypes.push(res);
            this.updated.next([...this.listFiledTypes]);
            Swal.fire('Added', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  UpdeteFormFiledType(form: FormFileType) {
    this.http
      .post(environment.apiUrl + `FormItemType/UpdateFormItemType`, form)
      .subscribe(
        (res) => {
          const index = this.listFiledTypes.findIndex((e) => e.id == form.id);
          this.listFiledTypes[index] = form;
          this.updated.next([...this.listFiledTypes]);
          Swal.fire('Updated', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  deleteFormFieldType(id: any) {
    this.http
      .post(
        environment.apiUrl + `FormItemType/DeleteFormItemType?id=${id}`,
        null
      )
      .subscribe(
        (res) => {
          this.listFiledTypes = this.listFiledTypes.filter((f) => f.id != id);
          this.updated.next([...this.listFiledTypes]);
          Swal.fire('Deleted!', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  getUpdates() {
    return this.updated.asObservable();
  }
}
