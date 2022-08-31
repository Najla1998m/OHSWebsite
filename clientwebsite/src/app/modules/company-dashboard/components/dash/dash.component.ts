import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LegendPosition, LegendType } from '@swimlane/ngx-charts';
import {
  BarStackChartData,
  lineChartData,
} from 'src/app/modules/core/mocks/charts-data';
import { LocalStorageServiceService } from 'src/app/modules/core/services/local-storage-service.service';
import { MangmentService } from 'src/app/modules/core/services/mangment.service';
import { UserService } from 'src/app/modules/core/services/user.service';
import { Roles } from 'src/app/modules/shared/models/roles';
import { UserDetails } from 'src/app/modules/shared/models/user-details';
import { StatisticsService } from '../../services/statistics.service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss'],
})
export class DashComponent implements OnInit {
  menu1: any[] = [];
  menu2: any[] = [];
  menu3: any[] = [];
  selected1!: any;
  selected2: any;
  userRole!: any;
  userDetails!: UserDetails;
  teams!: any[];
  statisticsData!: any;
  tasksCounts!: number;
  position = LegendPosition.Right;
  titles: any = {
    newTasksCount: 'المهام الجديدة',
    inProgressTasksCount: 'المهام المفعله',
    finishedTasksCount: 'المهام المنتهية',
  };

  saleData: any = [];

  staked: any = [...BarStackChartData];

  line: any = [...lineChartData];
  basicData!: any;

  constructor(
    private router: Router,
    private managementService: MangmentService,
    private localService: LocalStorageServiceService,
    private userService: UserService,
    private statisticsServ: StatisticsService,
    private translate: TranslateService
  ) {
    this.menu3 = [
      { name: 'إختيار 1', value: 1 },
      { name: 'إختيار 2', value: 2 },
      { name: 'إختيار 3', value: 3 },
      { name: 'إختيار 3', value: 4 },
      { name: 'إختيار 4', value: 5 },
    ];

    this.userRole = localService.UserRole;
  }

  ngOnInit() {
    let companyId = this.localService.CompanyId;
    this.loadUserInfo(companyId);
  }

  navigateToManagements() {
    this.router.navigate(['/company-dashboard/managements']);
  }

  navigateToDepartments() {
    this.router.navigate(['/company-dashboard/departments']);
  }

  navigateToRequests() {
    this.router.navigate(['/company-dashboard/tasks']);
  }

  navigateToEmployees() {
    if (this.userRole == Roles[8]) {
      this.router.navigate([
        '/company-dashboard/department-manager/teams',
        this.userDetails.user.userDepartments[0]?.id,
      ]);
    } else {
      this.router.navigate([
        '/company-dashboard/employees',
        this.userDetails.user.userDepartments[0]?.id,
      ]);
    }
  }

  navigateToDepartmentTeams() {}

  isCompanyAdmin() {
    if (this.userRole == Roles[11] || this.userRole == Roles[14]) {
      return true;
    }

    return false;
  }

  isManager() {
    if (this.userRole == Roles[12]) {
      return true;
    }

    return false;
  }

  isDeptMang() {
    if (this.userRole == Roles[8]) {
      return true;
    }

    return false;
  }

  loadUserInfo(companyId: any) {
    this.userService.getUserDetails().subscribe((user) => {
      this.userDetails = user;

      if (this.userRole == Roles[3]) {
        this.router.navigate(['/company-dashboard/employee-dashboard']);
        return;
      }

      if (this.userRole == Roles[11] || this.userRole == Roles[14]) {
        this.statisticsServ.GetStatisticsForAdmin();
        this.statisticsServ.statistics.subscribe((data) => {
          console.log('الاحصائيات', data);

          this.statisticsData = data;
          this.menu1 = this.statisticsData.managements;
          this.tasksCounts = this.statisticsData.ordersCount;
          // this.staked = this.convertData(this.statisticsData.tasksCount);
          this.staked = this.convertData(this.statisticsData.tasksCount);
          this.line = this.convertData(
            this.statisticsData.tasksCountForPreviousMonth
          );
          this.taskCountCalc();
        });
      }

      if (this.userRole == Roles[8]) {
        this.statisticsServ.GetTaskDashboardStatisticsForCompSupervisor();
        this.statisticsServ.statistics.subscribe((data) => {
          this.statisticsData = data;

          this.menu3 =
            this.statisticsData.departementsWithTasksCount[0]?.departements;

          this.staked = this.convertData(this.statisticsData.tasksCount);
          this.line = this.convertData(
            this.statisticsData.tasksCountForPreviousMonth
          );
          this.taskCountCalc();
        });
      }

      if (this.userRole == Roles[12]) {
        this.statisticsServ.GetTaskDashboardStatisticsForDeptManager();
        this.statisticsServ.statistics.subscribe((data) => {
          this.statisticsData = data;
          this.menu3 = this.statisticsData.departements;
          this.staked = this.convertData(this.statisticsData.tasksCount);
          this.line = this.convertData(
            this.statisticsData.tasksCountForPreviousMonth
          );
          this.taskCountCalc();
        });
      }
    });
  }

  loadDeptsByManagementId(id: number) {
    this.menu2 = [];
    this.menu2 = this.statisticsData.departementsWithTasksCount.find(
      (e: any) => e.managements == id
    )?.departements;
  }

  onDeptSelected(event: any) {
    console.log(event);

    this.saleData = this.convertData(event?.tasksCounts);
  }

  convertData(data: any) {
    debugger;
    let convertedData: any[] = [];
    for (const key in data) {
      convertedData.push({
        name: this.titles[key],
        value: data[key],
      });
    }

    return convertedData;
  }

  taskCountCalc() {
    this.tasksCounts =
      this.statisticsData.tasksCount.finishedTasksCount +
      this.statisticsData.tasksCount.inProgressTasksCount +
      this.statisticsData.tasksCount.newTasksCount;
  }
}
