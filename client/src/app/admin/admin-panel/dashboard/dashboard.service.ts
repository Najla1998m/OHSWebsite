import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getAllDepts() {
    return this.http.get(
      environment.apiUrl +
        `Departement/GetAllManagementsByCompanyId?CompanyId=${1}`
    );
  }

  getBar(id: any) {
    return this.http.get(
      environment.apiUrl + `Tasks/GetTaskStatisticsByStatus?DepartementId=${id}`
    );
  }

  getChart(id: any) {
    return this.http.get(
      environment.apiUrl + `Tasks/GetTaskStatisticsByLevel?DepartementId=${id}`
    );
  }
}
