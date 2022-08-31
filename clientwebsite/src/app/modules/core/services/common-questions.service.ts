import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Question } from '../../shared/models/question';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class CommonQuestionsService {
  private readonly url = environment.apiUrl;
  private questions: Question[] = [];
  private updates!: Subject<Question[]>;

  constructor(private http: HttpClient, private errorServices: ErrorService) {
    this.updates = new Subject<Question[]>();
  }

  getAllQuestion() {
    this.http
      .get<Question[]>(this.url + `QuestionsPage/GetAllQuestionsPage`)
      .subscribe(
        (data) => {
          this.questions = [...data];
          this.updates.next([...this.questions]);
        },
        (err) => {
          this.errorServices.handleError(err);
        }
      );
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
