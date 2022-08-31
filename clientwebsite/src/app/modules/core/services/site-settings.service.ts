import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SiteSettings } from '../../shared/models/site-settings';

@Injectable({
  providedIn: 'root',
})
export class SiteSettingsService {
  private readonly url = environment.apiUrl;
  private siteSettings: any[] = [];
  private updates = new Subject<any[]>();

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getAllSettings() {
    return this.http.get(this.url + 'Setting/GetAllSetting');
  }

  GetSettingInfo() {
    return this.http.get(this.url + `Setting/GetSettingInfo`);
  }

  getWebsitePolicyAndGeneralTerms() {
    return this.http.post(this.url + `Setting/GetSettingByListOfKeys`, [
      'Website_Policy',
      'General Terms',
    ]);
  }

  GetFormButtons() {
    return this.http.get(
      this.url + `Setting/GetSettingBySettingType?settingType=FormButton`
    );
  }

  GetSettingBySettingType(type: string) {
    return this.http.get(
      this.url + `Setting/GetSettingBySettingType?settingType=${type}`
    );
  }

  GetDashboardInfo() {
    return this.http.post(this.url + `AdminDashboard/GetAdminDashbord`, null);
  }
}
