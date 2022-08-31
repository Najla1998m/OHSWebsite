import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyVendorService } from '../../new-Company-Vendors/company-vendor.service';

@Component({
  selector: 'app-individualManagers',
  templateUrl: './individualManagers.component.html',
  styleUrls: ['./individualManagers.component.css'],
})
export class IndividualManagersComponent implements OnInit {
  listManger: any[] = [];
  id: any;
  constructor(
    private VendorService: CompanyVendorService,
    private ar: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.ar.params.subscribe((res: any) => {
      this.id = res.id;
    });
    this.VendorService.getAllMangers(this.id).subscribe((res: any) => {
      this.listManger = [...res];
    });
  }

  showAttach(id: any) {
    this.router.navigateByUrl(
      '/admin/admin-panel/customer-care/individual-vendors/attachmentManger/' +
        id
    );
  }
}
