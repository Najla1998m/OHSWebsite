import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ImageSlider } from 'src/app/admin/models/ImageSlider';
import { Questions } from 'src/app/admin/models/questions';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SliderService {
  SliderList: ImageSlider[] = [];

  updates = new Subject<ImageSlider[]>();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  getAll() {
    this.http
      .get<ImageSlider[]>(environment.apiUrl + `SliderImage/GetAllSliderImage`)
      .subscribe((resData) => {
        this.SliderList = resData;
        this.updates.next([...resData]);
      });
  }

  getById(id: number) {
    return this.http.get<ImageSlider>(
      environment.apiUrl + `SliderImage/GetSliderImageById/${id}`
    );
  }

  add(question: ImageSlider) {
    this.http
      .post<ImageSlider>(
        environment.apiUrl + `SliderImage/CreateSliderImage`,
        question
      )
      .subscribe(
        (resData) => {
          if (resData) {
            this.SliderList.push(resData);
            this.updates.next([...this.SliderList]);
            Swal.fire('Added!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error);
        }
      );
  }

  edit(id: number, question: ImageSlider) {
    this.http
      .post<ImageSlider>(
        environment.apiUrl + `SliderImage/UpdateSliderImage?id=${id}`,
        question
      )
      .subscribe(
        (resData) => {
          const index = this.SliderList.findIndex((q) => q.id == id);
          question.id = id;
          this.SliderList[index] = resData;
          this.updates.next([...this.SliderList]);
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
        environment.apiUrl + `SliderImage/DeleteSliderImage?id=${id}`,
        null
      )
      .subscribe((resData) => {
        if (resData) {
          let res = this.SliderList.filter((q) => q.id != id);
          this.SliderList = [...res];
          this.updates.next([...this.SliderList]);
          Swal.fire('Deleted!', '', 'success');
        }
      });
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
