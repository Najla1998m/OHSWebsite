import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Department } from '../../models/Department';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  basUrl = environment.apiUrl;
  private listTeam: Department[] = [];

  updates = new Subject<Department[]>();
  constructor(private http: HttpClient, private toastr: ToastrService) {}

  getAllTeams(id: number) {
    this.http
      .get<Department[]>(
        this.basUrl +
          `Departement/GetAllTeamsByCompanyIdAndDepartmentId?CompanyId=1&DepartmentId=${id}`
      )
      .subscribe((res) => {
        console.log(res);

        this.listTeam = res;
        this.updates.next([...this.listTeam]);
      });
  }

  addTeam(team: Department) {
    this.http
      .post<Department>(this.basUrl + `Departement/AddTeam`, team)
      .subscribe(
        (res) => {
          if (res) {
            this.listTeam.push(res);
            this.updates.next([...this.listTeam]);
            Swal.fire('Added!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error);
        }
      );
  }

  editTeam(id: number, team: Department) {
    this.http
      .post<Department>(
        this.basUrl + `Departement/UpdateSubDepartement?id=${id}`,
        team
      )
      .subscribe(
        (res) => {
          const index = this.listTeam.findIndex((e) => e.id == id);
          team.id = id;
          this.listTeam[index] = team;
          this.updates.next([...this.listTeam]);
          Swal.fire('Updated!', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error);
        }
      );
  }

  deleteTeam(id: number) {
    this.http
      .post(this.basUrl + `Departement/DeleteDepartement?id=${id}`, null)
      .subscribe(
        () => {
          const rs = this.listTeam.filter((e) => e.id != id);
          this.listTeam = [...rs];
          this.updates.next([...this.listTeam]);
          Swal.fire('Deleted!', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error);
        }
      );
  }
  getUpdates() {
    return this.updates.asObservable();
  }
  getTeamTypeRole() {
    return this.http.get(
      environment.apiUrl +
        `DepartmentTypeRole/GetRolesForDeptType?deptType=Team`
    );
  }

  getUsersInTeam(id: any) {
    return this.http.get(
      environment.apiUrl +
        `Users/GetAllUsersByDepartementId?departementId=${id}`
    );
  }
}
