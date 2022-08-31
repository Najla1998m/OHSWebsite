import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Category } from 'src/app/admin/models/category';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';
import { CategoriesService } from '../category/Categories.service';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  subCategories: Category[] = [];
  updates = new Subject<Category[]>();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private CatServ: CategoriesService
  ) {}

  getAll() {
    this.http
      .get<Category[]>(environment.apiUrl + `Categories/GetSubCategories`)
      .subscribe((resData: Category[]) => {
        this.subCategories = resData;
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
        environment.apiUrl + `Categories/AddSubCategories`,
        category
      )
      .subscribe(
        (resData) => {
          if (resData) {
            // ;
            this.CatServ.categories.push(resData);
            this.CatServ.updates.next([...this.CatServ.categories]);
            this.subCategories.push(resData);
            this.updates.next([...this.subCategories]);
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
    this.http
      .post<boolean>(
        environment.apiUrl + `Categories/UpdateSubCategory?id=${id}`,
        category
      )
      .subscribe(
        (resData) => {
          const index = this.CatServ.categories.findIndex((q) => q.id == id);
          category.id = id;
          this.CatServ.categories[index] = category;
          this.CatServ.updates.next([...this.CatServ.categories]);
          this.updates.next([...this.subCategories]);
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
        environment.apiUrl + `Categories/DeleteCategory?id=${id}`,
        null
      )
      .subscribe((resData) => {
        if (resData) {
          let res = this.CatServ.categories.filter((q) => q.id != id);
          // this.subCategories = [...res];
          // this.updates.next([...this.subCategories]);
          this.CatServ.categories = [...res];
          this.CatServ.updates.next([...this.CatServ.categories]);
          Swal.fire('Deleted!', '', 'success');
        }
      });
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
