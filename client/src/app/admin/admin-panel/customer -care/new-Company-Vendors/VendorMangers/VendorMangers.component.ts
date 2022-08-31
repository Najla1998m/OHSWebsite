import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyVendorService } from '../company-vendor.service';

@Component({
  selector: 'app-VendorMangers',
  templateUrl: './VendorMangers.component.html',
  styleUrls: ['./VendorMangers.component.css'],
})
export class VendorMangersComponent implements OnInit {
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
      '/admin/admin-panel/customer-care/company-vendors/attachmentManger/' + id
    );
  }
}
