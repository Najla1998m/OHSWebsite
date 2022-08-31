import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/modules/core/auth/auth.service';
import { ErrorService } from 'src/app/modules/core/services/error.service';
import { LocalStorageServiceService } from 'src/app/modules/core/services/local-storage-service.service';
import { MangmentService } from 'src/app/modules/core/services/mangment.service';
import { UserService } from 'src/app/modules/core/services/user.service';
import { Roles } from 'src/app/modules/shared/models/roles';
import { UserDetails } from 'src/app/modules/shared/models/user-details';
import Swal from 'sweetalert2';
import { PollItem } from '../../models/poll-item.model';
import { NavigationService } from '../../services/navigation.service';
import { RiskMangmentServicesService } from '../../services/risk-mangment-services.service';

interface detailsPoll {
  item: PollItem;
  agree: number;
  notAgree: number;
  unknown: number;
  agreeRate: number;
  danger: {
    con1: number;
    con2: number;
  };
  approval: any;
}

@Component({
  selector: 'app-poll-details',
  templateUrl: './poll-details.component.html',
  styleUrls: ['./poll-details.component.scss'],
})
export class PollDetailsComponent implements OnInit {
  @ViewChild('reports') reports!: ElementRef;
  @ViewChild('EmployeeReport') EmployeeReport!: ElementRef;

  pollDetails: detailsPoll[] = [];
  pollId!: number;
  effect!: any[];
  prop!: any[];
  role!: string;
  public RolesEnum = Roles;
  userId!: string;
  user!: UserDetails;
  team: any[] = [];
  pollApprovals: any[] = [];
  employeesList: any[] = [];
  employeesNumber!: number;
  totalCount!: number;
  pageNumber: number = 1;
  pageSize: number = 5;
  subscriber: any;
  noPollDetailsStatistic = false;
  constructor(
    private ar: ActivatedRoute,
    private pollService: RiskMangmentServicesService,
    private localServices: LocalStorageServiceService,
    private errorServices: ErrorService,
    private managementServices: MangmentService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
    public navigationService: NavigationService
  ) {
    this.role = localServices.UserRole;

    this.effect = [
      { title: 'لا أثر - 1', value: 1 },
      { title: 'أثر بسيط - 2', value: 2 },
      { title: 'أثر متوسط - 3', value: 3 },
      { title: 'أثر عالي - 4', value: 4 },
      { title: 'أثر عالي جدا - 5', value: 5 },
    ];

    this.prop = [
      { title: 'نادر -1', value: 1 },
      { title: 'قليلة -2', value: 2 },
      { title: 'متوسطة - 3', value: 3 },
      { title: 'عالية - 4', value: 4 },
      { title: 'عالية جدا - 5', value: 5 },
    ];
  }

  ngOnInit() {
    this.userId = this.localServices.UserId;
    this.role = this.localServices.UserRole;
    this.loadEmployees();
    this.loadPollDetails();
  }

  loadPollDetails() {
    this.ar.params.subscribe((url) => {
      this.pollId = url.id;
      this.employeesNumber = url.number;
      this.pollService
        .GetPollDetailsStatistic(this.pollId)
        .subscribe((data: any) => {
          debugger;
          if (!data.length) {
            this.noPollDetailsStatistic = true;
          }
          this.noPollDetailsStatistic = false;
          data.forEach((e: any) => {
            e.danger = {
              con1: 1,
              con2: 1,
            };
          });
          this.subscriber = Math.max.apply(
            Math,
            data.map(function (o: any) {
              return o.agree;
            })
          );
          this.pollDetails = [...data];
          console.log(data);
        });
    });
  }

  onApproval(pollItem: PollItem, value: boolean) {
    let model = {
      appUserId: this.userId,
      pollItemId: +pollItem.id,
      actionTaken: value,
      pollId: +this.pollId,
    };

    this.pollService.CreatePollApproval(model).subscribe(
      () => {
        Swal.fire('success', '', 'success').then(() => {
          this.loadPollDetails();
        });
      },
      (err) => {
        this.errorServices.handleError(err);
      }
    );
  }

  loadEmployees() {
    this.pollService
      .GetRiskEvaluationMembers(this.userId)
      .subscribe((data: any) => {
        this.team = [...data];
      });
  }

  navigateToActions(arr: any) {
    // arr.map((e: any) => {
    //   e.action = [];
    //   e.remove = false;
    // });

    console.table(arr);
    this.router.navigate(['/company-dashboard/poll-action', this.pollId], {
      state: [arr],
    });
  }

  getReportDetails(userId: string) {
    this.pollService.GetPollApprovals(this.pollId, userId).subscribe(
      (data: any) => {
        this.pollApprovals = [];
        if (data[0]) {
          this.pollApprovals = [...data[0]?.pollApprovalList];
        }
        this.reports.nativeElement.click();
      },
      (err) => {
        this.errorServices.handleError(err);
      }
    );
  }

  getPollItemName(item: any) {
    return this.pollDetails.find((e) => e.item.id == item.pollItemId)?.item
      .name;
  }

  getEmployeeReport(pollItemId: number) {
    this.pollService
      .GetEmployeesForPollItem(pollItemId)
      .subscribe((data: any) => {
        this.employeesList = [];
        this.employeesList = [...data];
        this.EmployeeReport.nativeElement.click();
      });
  }

  paginate(event: number) {
    this.pageNumber = event;
  }

  loadData() {
    this.loadEmployees();
    this.loadPollDetails();
  }
}
