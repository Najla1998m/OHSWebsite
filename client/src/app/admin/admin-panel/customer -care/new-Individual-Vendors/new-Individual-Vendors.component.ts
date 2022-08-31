import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IndividualVendorService } from './individualVendor.service';

@Component({
  selector: 'app-new-Individual-Vendors',
  templateUrl: './new-Individual-Vendors.component.html',
  styleUrls: ['./new-Individual-Vendors.component.css'],
})
export class NewIndividualVendorsComponent implements OnInit {
  listCompanyVendors: any[] = [];
  constructor(
    private vendorService: IndividualVendorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.vendorService.getIndividualVendors();
    this.vendorService.getUpdatedCompanyes().subscribe((res: any) => {
      this.listCompanyVendors = [...res];
      console.log(this.listCompanyVendors);
    });
  }

  showDepartments(id: any) {
    this.router.navigateByUrl(
      '/admin/admin-panel/customer-care/individual-vendors/department/' + id
    );
  }
  showAttachment(id: any) {
    this.router.navigateByUrl(
      '/admin/admin-panel/customer-care/individual-vendors/attachment/' + id
    );
  }

  showMangers(id: any) {
    this.router.navigateByUrl(
      '/admin/admin-panel/customer-care/individual-vendors/managers/' + id
    );
  }
}
