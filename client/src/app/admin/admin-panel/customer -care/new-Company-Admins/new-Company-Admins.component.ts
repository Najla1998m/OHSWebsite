import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SafeUrlPipe } from 'src/app/shared/pipes/safeUrl.pipe';
import { CompanyAdminService } from './companyAdmin.service';

@Component({
  selector: 'app-new-Company-Admins',
  templateUrl: './new-Company-Admins.component.html',
  styleUrls: ['./new-Company-Admins.component.css'],
})
export class NewCompanyAdminsComponent implements OnInit {
  listCompany: any[] = [];
  constructor(
    private companyservice: CompanyAdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.companyservice.getAllCompanies();
    this.companyservice.getUpdatedCompanyes().subscribe((res: any) => {
      this.listCompany = [...res];
    });
  }
  showDepartments(id: any) {
    this.router.navigateByUrl(
      '/admin/admin-panel/customer-care/company-admin/department/' + id
    );
  }

  showAttachment(id: any) {
    this.router.navigateByUrl(
      '/admin/admin-panel/customer-care/company-admin/attachment/' + id
    );
  }

  showMangers(id: any) {
    this.router.navigateByUrl(
      '/admin/admin-panel/customer-care/company-admin/managers/' + id
    );
  }
  getUrl(url: string) {
    console.log('ana msh arefiny', url);

    return 'url(' + url + ')';
  }
}
