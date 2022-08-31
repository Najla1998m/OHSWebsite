import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class CompanyVendorService {
  listVendors: any[] = [];
  updatedCompanies = new Subject<any[]>();
  constructor(private http: HttpClient) {}

  getCompanyVendors() {
    return this.http
      .get(environment.apiUrl + `Company/GetAllCompanyVendors`)
      .subscribe((res: any) => {
        this.listVendors = [...res];
        this.updatedCompanies.next([...this.listVendors]);
      });
  }

  getUpdatedCompanyes() {
    return this.updatedCompanies.asObservable();
  }

  getAllMangers(id: any) {
    return this.http.get(
      environment.apiUrl + `Users/GetAllManagersInCompany?CompanyId=${id}`
    );
  }
}
