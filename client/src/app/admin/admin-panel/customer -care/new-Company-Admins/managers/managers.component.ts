import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyAdminService } from '../companyAdmin.service';

@Component({
  selector: 'app-managers',
  templateUrl: './managers.component.html',
  styleUrls: ['./managers.component.css'],
})
export class ManagersComponent implements OnInit {
  listManger: any[] = [];
  id: any;
  constructor(
    private companyService: CompanyAdminService,
    private ar: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.ar.params.subscribe((res: any) => {
      this.id = res.id;
    });
    this.companyService.getAllMangers(this.id).subscribe((res: any) => {
      this.listManger = [...res];
    });
  }

  showAttach(id: any) {
    this.router.navigateByUrl(
      '/admin/admin-panel/customer-care/company-admin/attachmentManger/' + id
    );
  }
}
