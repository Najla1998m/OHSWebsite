import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StaticPages } from '../../shared/models/static-pages';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class StaticPagesService {
  private readonly url = environment.apiUrl;
  private pages: StaticPages[] = [];
  private updates!: Subject<StaticPages[]>;

  constructor(private http: HttpClient, private errorService: ErrorService) {
    this.updates = new Subject<StaticPages[]>();
  }

  getAllPages() {
    this.http
      .get<StaticPages[]>(this.url + 'StaticPage/GetAllStaticPage')
      .subscribe(
        (data) => {
          this.pages = [...data];
          this.updates.next([...this.pages]);
        },
        (err) => {
          this.errorService.handleError(err);
        }
      );
  }

  getPageById(id: number) {
    return this.http.get<StaticPages>(
      this.url + `StaticPage/GetStaticPageById/${id}`
    );
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
