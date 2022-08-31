import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IndividualVendorService {
  listVendors: any[] = [];
  updatedCompanies = new Subject<any[]>();
  constructor(private http: HttpClient) {}

  getIndividualVendors() {
    return this.http
      .get(environment.apiUrl + `Company/GetAllIndividualVendors`)
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
