import { Component, HostListener, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { Subject } from 'rxjs';
import { AuthService } from './modules/core/auth/auth.service';
import { SiteSettingsService } from './modules/core/services/site-settings.service';
import { SiteSettings } from './modules/shared/models/site-settings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ohs-website';
  userActivity: any;
  userInactive: Subject<any> = new Subject();

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService
  ) {
    this.setTimeout();
    this.userInactive.subscribe(() => this.authService.logout());
  }
  ngOnInit() {
    this.authService.autoLogin();
  }
  setTimeout() {
    this.userActivity = setTimeout(
      () => this.userInactive.next(undefined),
      5000*60
    );
  }

  @HostListener('window:mousemove') refreshUserState() {
    clearTimeout(this.userActivity);
    this.setTimeout();
  }
}
