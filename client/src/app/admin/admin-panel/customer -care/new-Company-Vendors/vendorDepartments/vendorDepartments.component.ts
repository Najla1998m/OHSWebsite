import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VendorDepartmentService } from './vendorDepartment.service';

@Component({
  selector: 'app-vendorDepartments',
  templateUrl: './vendorDepartments.component.html',
  styleUrls: ['./vendorDepartments.component.css'],
})
export class VendorDepartmentsComponent implements OnInit {
  id: any;
  listDepts: any[] = [];
  listRequests: any[] = [];
  constructor(
    private deptService: VendorDepartmentService,
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
