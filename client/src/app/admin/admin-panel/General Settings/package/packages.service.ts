import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Package } from 'src/app/admin/models/Package';
import { PackageDetails } from 'src/app/admin/models/packageDetails';
import { environment } from 'src/environments/environment.prod';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class PackagesService {
  packageList: Package[] = [];
  packageDetailsList: PackageDetails[] = [];
  updates = new Subject<Package[]>();
  updateDetails = new Subject<PackageDetails[]>();
  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  getAll() {
    this.http
      .get<Package[]>(environment.apiUrl + `Package/GetAllPackage`)
      .subscribe((resData) => {
        this.packageList = resData;
        this.updates.next([...resData]);
      });
  }

  getById(id: number) {
    return this.http.get<Package>(
      environment.apiUrl + `Package/GetPackageById/${id}`
    );
  }

  add(question: Package) {
    this.http
      .post<Package>(environment.apiUrl + `Package/CreatePackage`, question)
      .subscribe(
        (resData) => {
          if (resData) {
            this.packageList.push(resData);
            this.updates.next([...this.packageList]);
            Swal.fire('Added!', '', 'success');
          }
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error);
        }
      );
  }

  edit(id: number, question: Package) {
    this.http
      .post<boolean>(
        environment.apiUrl + `Package/UpdatePackage?id=${id}`,
        question
      )
      .subscribe(
        (resData) => {
          const index = this.packageList.findIndex((q) => q.id == id);
          question.id = id;
          this.packageList[index] = question;
          this.updates.next([...this.packageList]);
          Swal.fire('Updated!', '', 'success');
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error);
        }
      );
  }

  delete(id: number) {
    this.http
      .post<boolean>(
        environment.apiUrl + `Package/DeletePackage?id=${id}`,
        null
      )
      .subscribe((resData) => {
        if (resData) {
          let res = this.packageList.filter((q) => q.id != id);
          this.packageList = [...res];
          this.updates.next([...this.packageList]);
          Swal.fire('Deleted!', '', 'success');
        }
      });
  }

  getPackageDetails(id: number) {
    return this.http
      .get(environment.apiUrl + `Package/GetPackageDetailsByPackageId/${id}`)
      .subscribe((res: any) => {
        this.packageDetailsList = [...res];
        this.updateDetails.next([...this.packageDetailsList]);
      });
  }

  getCritaria() {
    return this.http.get(
      environment.apiUrl + `PackageCriteria/GetAllPackageCriteria`
    );
  }

  creatPackgeDetails(packge: any) {
    return this.http
      .post(environment.apiUrl + `Package/CreatePackageDetails`, packge)
      .subscribe(
        (res: any) => {
          Swal.fire('Added!', '', 'success');
          this.packageDetailsList.push(res);
          this.updateDetails.next([...this.packageDetailsList]);
        },
        (error: HttpErrorResponse) => {
          this.toastr.error(error.error);
        }
      );
  }

  updatePackageDetails(packag: any) {
    return this.http
      .post(environment.apiUrl + `Package/UpdatePackageDetails`, packag)
      .subscribe((res: any) => {
        Swal.fire('Updated!', '', 'success');
        const index = this.packageDetailsList.findIndex(
          (i) => i.id == packag.id
        );
        this.packageDetailsList[index] = packag;
        this.updateDetails.next([...this.packageDetailsList]);
      });
  }
  deletePackageDetails(id: any) {
    return this.http
      .post(environment.apiUrl + `Package/DeletePackageDetails?id=${id}`, null)
      .subscribe((res: any) => {
        this.packageDetailsList = this.packageDetailsList.filter(
          (q) => q.id != id
        );
        this.updateDetails.next([...this.packageDetailsList]);
        Swal.fire('Deleted!', '', 'success');
      });
  }
  getUpdates() {
    return this.updates.asObservable();
  }

  getDetailsUpdates() {
    return this.updateDetails.asObservable();
  }
}
