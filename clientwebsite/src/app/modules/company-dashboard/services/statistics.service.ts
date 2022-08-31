import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageServiceService } from '../../core/services/local-storage-service.service';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private readonly url = environment.apiUrl;
  public statistics = new Subject();

  constructor(
    private http: HttpClient,
    private localServices: LocalStorageServiceService
  ) {}

  GetStatisticsForAdmin() {
    let userid = this.localServices.UserId;
    this.http
      .get(
        this.url +
          `Dashboard/GetTaskDashboardStatisticsForAdmin?userId=${userid}`
      )
      .subscribe((data: any) => {
        this.statistics.next(data.data);
      });
  }

  GetTaskDashboardStatisticsForCompSupervisor() {
    let userid = this.localServices.UserId;
    this.http
      .get(
        this.url +
          `Dashboard/GetTaskDashboardStatisticsForCompSupervisor?userId=${userid}`
      )
      .subscribe((data: any) => {
        this.statistics.next(data.data);
      });
  }

  GetTaskDashboardStatisticsForDeptManager() {
    let userid = this.localServices.UserId;
    this.http
      .get(
        this.url +
          `Dashboard/GetTaskDashboardStatisticsForDeptManager?userId=${userid}`
      )
      .subscribe((data: any) => {
        this.statistics.next(data.data);
      });
  }

  GetTaskDashboardForEmployee() {
    let userid = this.localServices.UserId;
    this.http
      .get(this.url + `Dashboard/GetTaskDashboardForEmployee?userId=${userid}`)
      .subscribe((data: any) => {
        this.statistics.next(data.data);
      });
  }
}
