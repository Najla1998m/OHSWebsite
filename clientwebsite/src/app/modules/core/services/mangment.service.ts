import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Department } from '../../shared/models/department';

@Injectable({
  providedIn: 'root',
})
export class MangmentService {
  departments: Department[] = [];
  teams: any[] = [];
  teamsUpdates = new Subject<any>();

  update = new Subject<Department[]>();
  constructor(private http: HttpClient) {}

  getAll(id: number) {
    this.http
      .get<Department[]>(
        environment.apiUrl +
          `Departement/GetAllManagementsByCompanyId?CompanyId=${id}`
      )
      .subscribe((resData) => {
        this.departments = resData;
        this.update.next([...resData]);
      });
  }

  getAllDepts(id: number) {
    this.http
      .get<Department[]>(
        environment.apiUrl +
          `Departement/GetAllDepartementsByCompanyId?CompanyId=${id}`
      )
      .pipe(
        map((data) => {
          return data.map((e: any) => {
            e.departementLocation = JSON.parse(e.departementLocation);
            return e;
          });
        })
      )
      .subscribe((resData) => {
        console.log(resData);

        this.departments = resData;
        this.update.next([...resData]);
      });
  }

  getAllManagementByCompanyId(id: number) {
    return this.http.get(
      environment.apiUrl +
        `Departement/GetAllManagementsByCompanyId?CompanyId=${id}`
    );
  }

  getAllDepartementsByCompanyIdAndMangmentId(
    CompanyId: number,
    ManagementId: number
  ) {
    this.http
      .get<Department[]>(
        environment.apiUrl +
          `Departement/GetAllDepartementsByCompanyIdAndMangmentId?CompanyId=${CompanyId}&MangmentId=${ManagementId}`
      )
      .pipe(
        map((data) => {
          return data.map((e: any) => {
            e.departementLocation = JSON.parse(e.departementLocation);
            return e;
          });
        })
      )
      .subscribe((resData) => {
        console.log(resData);

        console.log(resData);
        this.departments = resData;
        this.update.next([...resData]);
      });
  }

  getAllDepartementsByCompanyIdAndMangmentId2(
    CompanyId: number,
    ManagementId: number
  ) {
    return this.http
      .get<Department[]>(
        environment.apiUrl +
          `Departement/GetAllDepartementsByCompanyIdAndMangmentId?CompanyId=${CompanyId}&MangmentId=${ManagementId}`
      )
      .pipe(
        map((data) => {
          return data.map((e: any) => {
            e.departementLocation = JSON.parse(e.departementLocation);
            return e;
          });
        })
      );
  }

  addDept(department: Department) {
    return this.http.post<Department>(
      environment.apiUrl + `Departement/AddDepartement`,
      department
    );
  }

  addMangement(data: Department) {
    return this.http.post<any>(
      environment.apiUrl + `Departement/AddManagement`,
      data
    );
  }

  addManger(data: any) {
    return this.http.post<any>(
      environment.apiUrl + `Account/RegisterAnonymousUser`,
      data
    );
  }

  GetAllTeamsByCompanyIdAndDepartmentId(companyID: number, deptID: number) {
    this.http
      .get(
        environment.apiUrl +
          `Departement/GetAllTeamsByCompanyIdAndDepartmentId?CompanyId=${companyID}&DepartmentId=${deptID}`
      )
      .subscribe((data: any) => {
        this.teams = [...data];
        this.teamsUpdates.next([...this.teams]);
      });
  }

  GetAllTeamsByCompanyIdAndDepartmentId2(companyID: number, deptID: number) {
    return this.http.get(
      environment.apiUrl +
        `Departement/GetAllTeamsByCompanyIdAndDepartmentId?CompanyId=${companyID}&DepartmentId=${deptID}`
    );
  }

  getUpdates() {
    return this.update.asObservable();
  }

  getTeamsUpdates() {
    return this.teamsUpdates.asObservable();
  }

  addTeam(model: any) {
    this.http
      .post(environment.apiUrl + `Departement/AddTeam`, model)
      .subscribe((data) => {
        this.teams.push(data);
        this.teamsUpdates.next([...this.teams]);
      });
  }

  GetAllUsersByDepartementId(id: number) {
    return this.http.get(
      environment.apiUrl +
        `Users/GetAllUsersByDepartementId?departementId=${id}`
    );
  }

  GetEmployeeInDept(userId: any, companyId: number) {
    return this.http.get(
      environment.apiUrl +
        `Users/GetEmployeeInDept?userId=${userId}&companyId=${companyId}`
    );
  }
}
