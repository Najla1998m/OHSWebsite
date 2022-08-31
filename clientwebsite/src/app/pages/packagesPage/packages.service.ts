import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ErrorService } from 'src/app/modules/core/services/error.service';
import { environment } from 'src/environments/environment';
import { Package } from './package';
import { PackageCriteria } from './package-criteria';

@Injectable({
  providedIn: 'root',
})
export class PackagesService {
  private readonly url = environment.apiUrl;

  constructor(private http: HttpClient, private errorServices: ErrorService) {}

  getAllPackages() {
    return this.http.get<Package[]>(this.url + `Package/GetAllPackage`);
  }

  getPackageCriteria() {
    return this.http.get<PackageCriteria[]>(
      this.url + `PackageCriteria/GetAllPackageCriteria`
    );
  }
}
