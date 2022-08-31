import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Skill } from '../../shared/models/skill';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private readonly url = environment.apiUrl;
  skills: Skill[] = [];
  private updates: Subject<Skill[]>;

  constructor(private http: HttpClient, private errorService: ErrorService) {
    this.updates = new Subject<Skill[]>();
  }

  getAll() {
    this.http.get<Skill[]>(this.url + `Skill/GetAllSkill`).subscribe(
      (data) => {
        this.skills = [...data];
        this.updates.next([...this.skills]);
      },
      (error) => {
        this.errorService.handleError(error);
      }
    );
  }

  getById(id: number) {
    return this.http.get<Skill>(this.url + ``);
  }

  getUpdates() {
    return this.updates.asObservable();
  }
}
