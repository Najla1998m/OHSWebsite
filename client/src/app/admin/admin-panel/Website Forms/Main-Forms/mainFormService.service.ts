import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { MainForm } from 'src/app/admin/models/MainForm';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MainFormServiceService {
  listMainForms: MainForm[] = [];
  private updated = new Subject<MainForm[]>();
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getAllMainForm() {
    this.http
      .get<MainForm[]>(environment.apiUrl + `Form/GetAllForms`)
      .subscribe((res: MainForm[]) => {
        this.listMainForms = [...res];
        this.updated.next([...this.listMainForms]);
      });
  }

  getMainFormById(id: number) {
    return this.http.get(
      environment.apiUrl + `Form/GetFormDataById?formId=${id}`
    );
  }

  GetAllDepartementsByCompanyId() {
    return this.http.get(
      environment.apiUrl +
        `Departement/GetAllDepartementsByCompanyId?CompanyId=1`
    );
  }

  createMainForm(form: MainForm) {
    this.http.post(environment.apiUrl + `Form/CreateForm`, form).subscribe(
      (res: any) => {
        this.listMainForms.push(res);
        this.updated.next([...this.listMainForms]);
        Swal.fire('Success', '', 'success');
      },
      (error: HttpErrorResponse) => {
        // ;
        this.toastr.error(error.error);
      }
    );
  }

  updateMainForm(form: MainForm) {
    this.http.post(environment.apiUrl + `Form/UpdateForm`, form).subscribe(
      (res) => {
        const index = this.listMainForms.findIndex((e) => e.id == form.id);
        this.listMainForms[index] = form;
        this.updated.next([...this.listMainForms]);
        Swal.fire('Updated', '', 'success');
      },
      (error: HttpErrorResponse) => {
        // ;
        this.toastr.error(error.error);
      }
    );
  }

  DeleteFormById(form: MainForm) {
    this.http
      .post(environment.apiUrl + `Form/DeleteForm?id=${form.id}`, null)
      .subscribe(
        (res) => {
          this.listMainForms = this.listMainForms.filter(
            (e) => e.id != form.id
          );
          this.updated.next([...this.listMainForms]);
          Swal.fire('Delete', '', 'success');
        },
        (error: HttpErrorResponse) => {
          // ;
          this.toastr.error(error.error);
        }
      );
  }

  getUpdates() {
    return this.updated.asObservable();
  }
}
