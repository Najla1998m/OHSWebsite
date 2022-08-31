import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { StaticPage } from '../../models/StaticPage';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ErrorHandlerService } from 'src/app/shared/services/errorHandler.service';

@Injectable({
  providedIn: 'root',
})
export class StaticPageService {
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private handeler: ErrorHandlerService
  ) {}

  Pages: StaticPage[] = [];
  updates = new Subject<StaticPage[]>();

  getAllPages() {
    this.http
      .get<StaticPage[]>(environment.apiUrl + `StaticPage/GetAllStaticPage`)
      .subscribe((resData) => {
        this.Pages = resData;
        this.updates.next([...resData]);
      });
  }

  getById(id: any) {
    return this.http.get<StaticPage>(
      environment.apiUrl + `StaticPage/GetStaticPageById/${id}`
    );
    // return this.Pages.find((p) => p.id == id);
  }

  add(page: StaticPage) {
    return this.http
      .post<StaticPage>(
        environment.apiUrl + `StaticPage/CreateStaticPage`,
        page
      )
      .subscribe(
        (resData) => {
          if (resData) {
            this.Pages.push(resData);
            this.updates.next([...this.Pages]);

            this.router.navigate(['/admin/admin-panel/static-pages']);
          }
        },
        (error: any) => {
          this.handeler.handleError(error.error);
        }
      );
  }

  edit(id: any, page: StaticPage) {
    // const index = this.Pages.findIndex((p) => p.id == id);
    // this.Pages[index] = page;
    return this.http
      .post<StaticPage>(
        environment.apiUrl + `StaticPage/UpdateStaticPage?id=${id}`,
        page
      )
      .subscribe(
        (resData) => {
          const index = this.Pages.findIndex((q) => q.id == id);
          page.id = id;
          this.Pages[index] = resData;
          this.updates.next([...this.Pages]);
          // Swal.fire('Updated!', '', 'success');
          // if (!resData) {
          //   return;
          // }
          // this.getAllPages();
          this.router.navigateByUrl('/admin/admin-panel/static-pages');
        },
        (error: any) => {
          this.handeler.handleError(error.error);
        }
      );
  }

  delete(id: any) {
    this.http
      .post<StaticPage[]>(
        environment.apiUrl + `StaticPage/DeleteStaticPage?id=${id}`,
        null
      )
      .subscribe((resData) => {
        if (resData) {
          let res = this.Pages.filter((p) => p.id != id);
          this.Pages = [...res];
          this.updates.next([...this.Pages]);
          Swal.fire('Deleted!', '', 'success');
        }
      });
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
