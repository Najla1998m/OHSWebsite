import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CompanyAdminService {
  listCompanies: any[] = [];
  updatedCompanies = new Subject<any[]>();
  constructor(private http: HttpClient) {}

  getAllCompanies() {
    this.http
      .get(environment.apiUrl + `Company/GetAllCompaniesAdmin`)
      .subscribe((res: any) => {
        this.listCompanies = [...res];
        this.updatedCompanies.next([...this.listCompanies]);
      });
  }

  companyDetails(id: any) {
    return this.http.get(
      environment.apiUrl +
        `Departement/GetAllManagementsByCompanyId?CompanyId=${id}`
    );
  }

  getAllMangers(id: any) {
    return this.http.get(
      environment.apiUrl + `Users/GetAllManagersInCompany?CompanyId=${id}`
    );
  }
  getUpdatedCompanyes() {
    return this.updatedCompanies.asObservable();
  }

  getAllDepts() {
    return this.http.get(
      environment.apiUrl +
        `Departement/GetAllManagementsByCompanyId?CompanyId=${1}`
    );
  }

  getUserDetails(id: any) {
    return this.http.get(environment.apiUrl + `Users/GetUserDetails/${id}`);
  }

  UpdateUser(id: any, data: any) {
    return this.http.post(
      environment.apiUrl + `Departement/UpdateManagment?id=${id}`,
      data
    );
  }
}
