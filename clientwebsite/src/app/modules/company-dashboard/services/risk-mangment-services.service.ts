import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserDetails } from '../../shared/models/user-details';
import { PollItem } from '../models/poll-item.model';

@Injectable({
  providedIn: 'root',
})
export class RiskMangmentServicesService {
  private readonly url = environment.apiUrl;
  private pollItems: PollItem[] = [];
  private updates = new Subject<PollItem[]>();

  constructor(private http: HttpClient) {}

  GetDefaultPollItems() {
    return this.http.get<PollItem[]>(this.url + `PollItem/GetDefaultPollItems`);
  }

  GetPollsByCompanyId(id: any) {
    this.http
      .get<PollItem[]>(this.url + `Poll/GetPollsByCompanyId?CompanyId=${id}`)
      .subscribe((res: any) => {
        this.pollItems = [...res];
        this.updates.next([...this.pollItems]);
      });
  }

  CreatePoll(model: any) {
    this.http
      .post(this.url + `Poll/CreatePoll`, model)
      .subscribe((data: any) => {
        this.pollItems.push(data);
        this.updates.next([...this.pollItems]);
      });
  }

  CreatePollDetails(model: any[]) {
    return this.http.post(this.url + `PollDetails/CreatePollDetails`, model);
  }

  GetPollDetailsStatistic(id: any) {
    return this.http.get<any>(
      this.url + `PollDetails/GetPollDetailsStatistic?pollId=${id}`
    );
  }

  GetPollDetailsByPollId(id: number) {
    return this.http.get(this.url + `Poll/GetPollDetailsByPollId?pollId=${id}`);
  }

  CreatePollApproval(model: any) {
    return this.http.post(this.url + `PollApproval/CreatePollApproval`, model);
  }

  GetPollApprovals(pollId: number, userId: string) {
    return this.http.get(
      this.url +
        `PollApproval/GetPollApprovals?pollId=${pollId}&userId=${userId}`
    );
  }

  getUpdates() {
    return this.updates.asObservable();
  }

  GetRiskEvaluationMembers(userId: string) {
    return this.http.get<UserDetails>(
      this.url + `Users/GetRiskEvaluationMembers?userId=${userId}`
    );
  }

  CreatePollItemAction(model: any) {
    return this.http.post(
      this.url + `PollItemActions/CreatePollItemAction`,
      model
    );
  }

  GetEmployeesForPollItem(item: number) {
    return this.http.get(
      this.url + `PollDetails/GetEmployeesForPollItem?itemId=${item}`
    );
  }
}
  