import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { MangementServiceService } from '../../common-pages/Managements/mangementService.service';
import { TeamsService } from '../Teams.service';

@Component({
  selector: 'app-teamDetails',
  templateUrl: './teamDetails.component.html',
  styleUrls: ['./teamDetails.component.css'],
})
export class TeamDetailsComponent implements OnInit {
  employees: any[];
  id: any;
  constructor(
    private teamService: TeamsService,
    private ar: ActivatedRoute,
    private mangeService: MangementServiceService
  ) {}

  ngOnInit() {
    this.ar.params.subscribe((res) => {
      this.id = res.id;
    });
    this.teamService.getUsersInTeam(this.id).subscribe((res: any) => {
      this.employees = [...res];
    });
  }

  onDelete(id: any) {
    this.mangeService.deleteUser(id).subscribe(() => {
      Swal.fire('Deleted!', '', 'success').then((r) => {
        this.teamService.getUsersInTeam(this.id).subscribe((res: any) => {
          this.employees = [...res];
        });
      });
    });
  }
}
