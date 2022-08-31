import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class IndividualDepartmentService {
  listDepts: any[] = [];
  constructor(private http: HttpClient) {}

  getDepartments(id: any) {
    return this.http.get(
      environment.apiUrl +
        `Departement/GetAllManagementsByCompanyId?CompanyId=${id}`
    );
  }
  getAllRequestes(id: any) {
    return this.http.get(
      environment.apiUrl +
        `OrdersControllers/GetOrdersForCompany?companyId=${id}`
    );
  }
}
