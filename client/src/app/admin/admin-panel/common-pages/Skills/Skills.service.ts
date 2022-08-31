import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { Skill } from 'src/app/admin/models/Skill';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  listSkills: Skill[] = [];
  updated = new BehaviorSubject<Skill[]>([]);
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private toast: ToastrService) {}

  getAll() {
    this.http
      .get<Skill[]>(this.baseUrl + 'Skill/GetAllSkill')
      .subscribe((res) => {
        this.listSkills = res;
        this.updated.next([...this.listSkills]);
      });
  }
  getById(id: number) {
    return this.http.get<Skill>(this.baseUrl + 'Skill/GetSkillById?id=' + id);
  }

  add(skill: Skill) {
    this.http.post<Skill>(this.baseUrl + 'Skill/CreateSkill', skill).subscribe(
      (res) => {
        if (res) {
          this.listSkills.push(res);
          this.updated.next([...this.listSkills]);
          Swal.fire('Added!', '', 'success');
        }
      },
      (error: HttpErrorResponse) => {
        this.toast.error(error.error);
      }
    );
  }

  edit(id: number, skill: Skill) {
    console.log(skill);

    this.http
      .post<Skill>(this.baseUrl + `Skill/UpdateSkill?id=` + id, skill)
      .subscribe(
        (res) => {
          const index = this.listSkills.findIndex((s) => s.id == id);
          skill.id = id;
          this.listSkills[index] = skill;
          this.updated.next([...this.listSkills]);

          Swal.fire('updated', '', 'success');
        },
        (errror: HttpErrorResponse) => {
          this.toast.error(errror.error);
        }
      );
  }

  delete(id: number) {
    this.http
      .post<boolean>(this.baseUrl + `Skill/DeleteSkill?id=${id}`, null)
      .subscribe((res) => {
        console.log('delete', res);

        if (res) {
          let data = this.listSkills.filter((s) => s.id != id);
          this.listSkills = [...data];
          this.updated.next([...this.listSkills]);
          Swal.fire('Deleted!', '', 'success');
        }
      });
  }

  getUpdates() {
    return this.updated.asObservable();
  }
}
