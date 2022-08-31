import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IndividualDepartmentService } from './individualDepartment.service';

@Component({
  selector: 'app-individualDepartment',
  templateUrl: './individualDepartment.component.html',
  styleUrls: ['./individualDepartment.component.css'],
})
export class IndividualDepartmentComponent implements OnInit {
  id: any;
  listDepts: any[] = [];
  listRequests: any[] = [];
  constructor(
    private deptService: IndividualDepartmentService,
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
