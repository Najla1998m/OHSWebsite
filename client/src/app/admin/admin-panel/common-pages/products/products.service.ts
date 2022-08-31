import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Product } from 'src/app/admin/models/product';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  products: Product[] = [];

  updates = new Subject<Product[]>();

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getAll() {
    this.http
      .get<Product[]>(environment.apiUrl + `Product/GetAllProduct`)
      .subscribe((resData) => {
        console.log(resData);
        this.products = resData;
        this.updates.next([...resData]);
      });
  }

  getById(id: any) {
    return this.products.find((p) => p.id == id);
  }

  add(product: Product) {
    console.log(product);
    // ;
    this.http
      .post<Product>(environment.apiUrl + `Product/CreateProduct`, product)
      .subscribe(
        (resData) => {
          if (resData) {
            // ;
            this.products.push(resData);
            this.updates.next([...this.products]);
            Swal.fire('Added!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          // ;
          this.toastr.error(error.error);
        }
      );
  }

  edit(id: number, product: Product) {
    console.log(product);

    this.http
      .post<Product>(
        environment.apiUrl + `Product/UpdateProduct?id=${id}`,
        product
      )
      .subscribe(
        (resData) => {
          // ;
          const index = this.products.findIndex((q) => q.id == id);
          product.id = id;

          this.products[index] = product;
          this.updates.next([...this.products]);
          Swal.fire('Updated!', '', 'success');
        },
        (error: HttpErrorResponse) => {
          // ;
          this.toastr.error(error.error);
        }
      );
  }

  delete(id: any) {
    this.http
      .post<boolean>(
        environment.apiUrl + `Product/DeleteProduct?id=${id}`,
        null
      )
      .subscribe((resData) => {
        if (resData) {
          let res = this.products.filter((q) => q.id != id);
          this.products = [...res];
          this.updates.next([...this.products]);
          Swal.fire('Deleted!', '', 'success');
        }
      });
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
