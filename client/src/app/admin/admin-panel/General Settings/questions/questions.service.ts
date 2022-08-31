import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Questions } from 'src/app/admin/models/questions';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  QuestionsList: Questions[] = [];

  updates = new Subject<Questions[]>();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  getAll() {
    this.http
      .get<Questions[]>(
        environment.apiUrl + `QuestionsPage/GetAllQuestionsPage`
      )
      .subscribe((resData) => {
        this.QuestionsList = resData;
        this.updates.next([...resData]);
      });
    // return [...this.QuestionsList];
  }

  getById(id: number) {
    return this.http.get<Questions>(
      environment.apiUrl + `QuestionsPage/GetQuestionsPageById/${id}`
    );
    // return this.QuestionsList.find((q) => q.Id == id);
  }

  add(question: Questions) {
    this.http
      .post<Questions>(
        environment.apiUrl + `QuestionsPage/CreateQuestionsPage`,
        question
      )
      .subscribe(
        (resData) => {
          if (resData) {
            this.QuestionsList.push(resData);
            this.updates.next([...this.QuestionsList]);
            Swal.fire('Added!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error);
        }
      );
  }

  edit(id: number, question: Questions) {
    // const index = this.QuestionsList.findIndex((q) => q.Id == id);
    // this.QuestionsList[index] = question;
    // this.updates.next([...this.QuestionsList]);

    this.http
      .post<boolean>(
        environment.apiUrl + `QuestionsPage/UpdateQuestionsPage?id=${id}`,
        question
      )
      .subscribe(
        (resData) => {
          const index = this.QuestionsList.findIndex((q) => q.id == id);
          question.id = id;
          this.QuestionsList[index] = question;
          this.updates.next([...this.QuestionsList]);
          Swal.fire('Updated!', '', 'success');
          // if (!resData) {
          //   return;
          // }
          // this.getAll();
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error);
        }
      );
  }

  delete(id: number) {
    // let res = this.QuestionsList.filter((q) => q.Id != id);
    // this.QuestionsList = [...res];
    // this.updates.next([...this.QuestionsList]);

    this.http
      .post<boolean>(
        environment.apiUrl + `QuestionsPage/DeleteQuestionsPage?id=${id}`,
        null
      )
      .subscribe((resData) => {
        if (resData) {
          let res = this.QuestionsList.filter((q) => q.id != id);
          this.QuestionsList = [...res];
          this.updates.next([...this.QuestionsList]);
          Swal.fire('Deleted!', '', 'success');
        }
      });
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
