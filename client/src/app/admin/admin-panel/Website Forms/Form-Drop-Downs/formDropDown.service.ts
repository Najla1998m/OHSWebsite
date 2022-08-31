import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { DropDownForm } from 'src/app/admin/models/DropDownForm';
import { FormOptionSetItem } from 'src/app/admin/models/formOptionSetItem';
import { MainForm } from 'src/app/admin/models/MainForm';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class FormDropDownService {
  private listFormDropDown: DropDownForm[] = [];
  listAllForms: MainForm[] = [];
  listOptionSet: FormOptionSetItem[] = [];
  private updatedOptions = new Subject<FormOptionSetItem[]>();
  private updatedAllDrop = new Subject<DropDownForm[]>();
  private updatedAll = new Subject<MainForm[]>();
  constructor(private http: HttpClient, private toast: ToastrService) {}
  getAllForms() {
    this.http
      .get(environment.apiUrl + `Form/GetAllForms`)
      .subscribe((res: any) => {
        this.listAllForms = [...res];
        this.updatedAll.next([...this.listAllForms]);
      });
  }

  // getAllDropDownForms(id: number) {
  //   this.http
  //     .get(
  //       environment.apiUrl +
  //         `FormOptionSet/GetAllFormOptionSetByFormId?formId=${id}`
  //     )
  //     .subscribe((res: any) => {
  //       this.listFormDropDown = [...res];
  //       this.updatedAllDrop.next([...this.listFormDropDown]);
  //     });
  // }

  //FormOptionSet/GetAllFormOptionSet
  GetAllFormOptionSet() {
    this.http
      .get(environment.apiUrl + `FormOptionSet/GetAllFormOptionSet`)
      .subscribe((res: any) => {
        this.listFormDropDown = [...res];
        this.updatedAllDrop.next([...this.listFormDropDown]);
      });
  }

  getDropDownById(id: number) {
    return this.http.get(
      environment.apiUrl +
        `FormOptionSet/GetFormOptionSetById?formOptionSetId=${id}`
    );
  }

  //GetFormOptionSetById?formOptionSetId=1
  allOptionByFormId(id: number) {
    this.http
      .get(
        environment.apiUrl +
          `FormOptionSet/GetFormOptionSetById?formOptionSetId=${id}`
      )
      .subscribe((res: any) => {
        this.listOptionSet = [...res[0].formOptionSetItems];
        this.updatedOptions.next([...this.listOptionSet]);
      });
  }

  creatOptionItem(option: FormOptionSetItem) {
    this.http
      .post(
        environment.apiUrl + `FormOptionSetItemItem/CreateFormOptionSetItem`,
        option
      )
      .subscribe(
        (res: any) => {
          if (res) {
            this.listOptionSet.push(res);
            this.updatedOptions.next([...this.listOptionSet]);
            Swal.fire('Success', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  deleteOptionItem(id: number) {
    this.http
      .post(
        environment.apiUrl +
          `FormOptionSetItemItem/DeleteFormOptionSetItem?id=${id}`,
        {}
      )
      .subscribe(
        () => {
          const rs = this.listOptionSet.filter((e) => e.id != id);
          this.listOptionSet = [...rs];
          this.updatedOptions.next([...this.listOptionSet]);
          Swal.fire('Deleted!', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }
  addDropDownForm(drop: DropDownForm) {
    this.http
      .post(environment.apiUrl + `FormOptionSet/CreateFormOptionSet`, drop)
      .subscribe(
        (res: any) => {
          this.listFormDropDown.push(res);
          this.updatedAllDrop.next([...this.listFormDropDown]);
          Swal.fire('Success', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  updateDropDownForm(form: DropDownForm) {
    this.http
      .post(environment.apiUrl + `FormOptionSet/UpdateFormOptionSet`, form)
      .subscribe(
        (res) => {
          let index = this.listFormDropDown.findIndex((e) => e.id == form.id);
          this.listFormDropDown[index] = form;
          this.updatedAllDrop.next([...this.listFormDropDown]);
          Swal.fire('Updated', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  deleteDropdown(id: any) {
    this.http
      .post(
        environment.apiUrl + `FormOptionSet/DeleteFormOptionSet?id=${id}`,
        null
      )
      .subscribe(
        (res) => {
          this.listFormDropDown = this.listFormDropDown.filter(
            (d) => d.id != id
          );
          this.updatedAllDrop.next([...this.listFormDropDown]);
          Swal.fire('Deleted!', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toast.error(error.error);
        }
      );
  }

  getUpdatesAllForms() {
    return this.updatedAll.asObservable();
  }

  getUpdatesAllDropForm() {
    return this.updatedAllDrop.asObservable();
  }

  getUpdateOptions() {
    return this.updatedOptions.asObservable();
  }
}
