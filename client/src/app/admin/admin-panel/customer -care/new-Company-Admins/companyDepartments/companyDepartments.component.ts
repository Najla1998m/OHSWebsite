import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CompanyDepartmentsService } from './companyDepartments.service';

@Component({
  selector: 'app-companyDepartments',
  templateUrl: './companyDepartments.component.html',
  styleUrls: ['./companyDepartments.component.css'],
})
export class CompanyDepartmentsComponent implements OnInit {
  id: any;
  listDepts: any[] = [];
  listRequests: any[] = [];
  constructor(
    private deptService: CompanyDepartmentsService,
    private ar: ActivatedRoute
  ) {}

  ngOnInit() {
    this.ar.params.subscribe((res) => {
      this.id = res.id;
      this.deptService.getDepartments(this.id).subscribe((res: any) => {
        this.listDepts = [...res];
      });

      this.deptService.getAllRequestes(this.id).subscribe((res: any) => {
        this.listRequests = [...res];
      });
    });
  }

  convert(d: any) {
    return new Date(d).toLocaleString([], { hour12: true });
  }
}
