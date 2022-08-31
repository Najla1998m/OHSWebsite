import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompanyVendorService } from './company-vendor.service';

@Component({
  selector: 'app-new-Company-Vendors',
  templateUrl: './new-Company-Vendors.component.html',
  styleUrls: ['./new-Company-Vendors.component.css'],
})
export class NewCompanyVendorsComponent implements OnInit {
  listCompanyVendors: any[] = [];
  constructor(
    private vendorService: CompanyVendorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.vendorService.getCompanyVendors();
    this.vendorService.getUpdatedCompanyes().subscribe((res: any) => {
      this.listCompanyVendors = [...res];
    });
  }

  showDepartments(id: any) {
    this.router.navigateByUrl(
      '/admin/admin-panel/customer-care/company-vendors/department/' + id
    );
  }
  showAttachment(id: any) {
    this.router.navigateByUrl(
      '/admin/admin-panel/customer-care/company-vendors/attachment/' + id
    );
  }

  showMangers(id: any) {
    this.router.navigateByUrl(
      '/admin/admin-panel/customer-care/company-vendors/managers/' + id
    );
  }
}
