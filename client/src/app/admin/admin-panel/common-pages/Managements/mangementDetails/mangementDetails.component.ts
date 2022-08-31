import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { MangementServiceService } from '../mangementService.service';

@Component({
  selector: 'app-mangementDetails',
  templateUrl: './mangementDetails.component.html',
  styleUrls: ['./mangementDetails.component.css'],
})
export class MangementDetailsComponent implements OnInit {
  employees: any[];
  id: number;
  constructor(
    private mangeService: MangementServiceService,
    private ar: ActivatedRoute
  ) {}

  ngOnInit() {
    this.ar.params.subscribe((res) => {
      this.id = res.id;
    });
    this.mangeService.getUsersInMangement(this.id).subscribe((res: any) => {
      this.employees = res;
    });
  }

  onDelete(id: any) {
    this.mangeService.deleteUser(id).subscribe(() => {
      Swal.fire('Deleted!', '', 'success').then((r) => {
        this.mangeService.getUsersInMangement(this.id).subscribe((res: any) => {
          this.employees = res;
        });
      });
    });
  }
}
