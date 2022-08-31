import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import { privateEncrypt } from 'crypto';
import { AuthService } from 'src/app/Auth/Auth.service';
import { LangService } from 'src/app/shared/services/lang.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
})
export class AdminPanelComponent implements OnInit {
  /**------------------------------------------------------------------------------------------------
   **                      this part of translation will be moved with layout
   *------------------------------------------------------------------------------------------------**/

  isToggled: boolean = true;
  isLangAr!: boolean;
  currentLang!: string;
  htmlTag!: any;
  isAdmin: boolean = true;
  userName: string;
  constructor(
    public translate: TranslateService,
    public langService: LangService,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private auth: AuthService
  ) {
    this.htmlTag = this.document.getElementsByTagName(
      'html'
    )[0] as HTMLHtmlElement;
  }

  ngOnInit(): void {
    this.checkLang();
    this.langService.getIsLangArHandler().subscribe((state: boolean) => {
      this.isLangAr = state;
    });

    this.auth.user.subscribe((user) => {
      console.log(user);
      this.userName = user?.username;
      this.isAdmin = user?.isAdmin();
    });
  }

  toggle() {
    this.isToggled = !this.isToggled;
  }

  checkLang() {
    this.currentLang = this.langService.getCurrentLang();

    if (this.currentLang == 'ar') {
      this.isLangAr = true;
      this.htmlTag.dir = 'rtl';
      this.htmlTag.lang = 'ar';
    } else {
      this.isLangAr = false;
      this.htmlTag.dir = 'ltr';
      this.htmlTag.lang = 'en';
    }
    this.translate.use(this.currentLang);
  }

  onLangChange() {
    if (this.isLangAr) {
      this.langService.changeCurrentLang('en');
      this.translate.use('en');
      this.htmlTag.dir = 'ltr';
      this.htmlTag.lang = 'en';
    } else {
      this.langService.changeCurrentLang('ar');
      this.translate.use('ar');
      this.htmlTag.dir = 'rtl';
      this.htmlTag.lang = 'ar';
    }
  }
  logout() {
    this.auth.logout();
  }
}
