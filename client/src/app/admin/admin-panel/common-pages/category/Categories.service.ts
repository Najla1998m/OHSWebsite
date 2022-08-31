import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Category } from 'src/app/admin/models/category';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  categories: Category[] = [];
  updates = new Subject<Category[]>();

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getAll() {
    this.http
      .get<Category[]>(environment.apiUrl + `Categories/GetAllCategories`)
      .subscribe((resData: Category[]) => {
        this.categories = resData;
        console.log(resData);

        this.updates.next([...resData]);
      });
  }

  getById(id: number) {
    return this.http.get<Category>(
      environment.apiUrl + `Categories/GetCategoriesByDepartmentId/${id}`
    );
  }

  add(category: Category) {
    console.log(category);
    this.http
      .post<Category>(
        environment.apiUrl + `Categories/AddParentCategories`,
        category
      )
      .subscribe(
        (resData) => {
          if (resData) {
            this.categories.push(resData);
            this.updates.next([...this.categories]);
            Swal.fire('Added!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          // ;
          this.toastr.error(error.error);
        }
      );
  }

  edit(id: number, category: Category) {
    console.log(category);

    this.http
      .post<boolean>(
        environment.apiUrl + `Categories/UpdateParentCategory?id=${id}`,
        category
      )
      .subscribe(
        (resData) => {
          // ;
          const index = this.categories.findIndex((q) => q.id == id);
          category.id = id;
          this.categories[index] = category;
          this.updates.next([...this.categories]);
          Swal.fire('Updated!', '', 'success');
        },
        (error: HttpErrorResponse) => {
          // ;
          this.toastr.error(error.error);
        }
      );
  }

  delete(id: number) {
    this.http
      .post<boolean>(
        environment.apiUrl + `Categories/DeleteCategory?id=${id}`,
        null
      )
      .subscribe((resData) => {
        if (resData) {
          let res = this.categories.filter((q) => q.id != id);
          this.categories = [...res];
          this.updates.next([...this.categories]);
          Swal.fire('Deleted!', '', 'success');
        }
      });
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
