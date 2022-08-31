import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Roles } from 'src/app/modules/shared/models/roles';
import { SiteSettings } from 'src/app/modules/shared/models/site-settings';
import { StaticPages } from 'src/app/modules/shared/models/static-pages';
import { User } from 'src/app/modules/shared/models/User';
import { AuthService } from '../../auth/auth.service';
import { LangService } from '../../services/lang.service';
import { SiteSettingsService } from '../../services/site-settings.service';
import { StaticPagesService } from '../../services/static-pages.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  isLangAr!: boolean;
  currentLang!: string;
  htmlTag!: any;
  isScrolled!: boolean;
  inAuth!: boolean;
  list!: StaticPages[];
  accountsForm!: FormGroup;
  user!: any;
  isAuthenticated: boolean = false;
  private userSub!: Subscription;
  userDetails!: any;
  showPackages!: boolean;

  constructor(
    public translate: TranslateService,
    public langService: LangService,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private staticPageService: StaticPagesService,
    private fb: FormBuilder,
    private authService: AuthService,
    private userServices: UserService,
    private siteSettingService: SiteSettingsService
  ) {
    this.htmlTag = this.document.getElementsByTagName(
      'html'
    )[0] as HTMLHtmlElement;

    this.accountsForm = this.fb.group({
      type: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.userSub = this.authService.user.subscribe((user) => {
      user?.getDecodedToken();

      this.user = user?.getDecodedToken();
      this.isAuthenticated = !!user;

      this.userServices
        .getUserById(user?.getUserId())
        .subscribe((data: any) => {
          this.userDetails = data;

          console.log('updated', data);
        });
    });

    this.staticPageService.getAllPages();
    this.staticPageService.getUpdates().subscribe((data) => {
      this.list = [...data]
        .filter((s) => s.isVisible)
        .sort((a, b) => a.order - b.order);
    });

    this.checkLang();
    this.langService.getIsLangArHandler().subscribe((state: boolean) => {
      this.isLangAr = state;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url) {
        if (!event.url.includes('home') && !(event.url.split('/')[1] == '')) {
          this.inAuth = true;
        } else {
          this.inAuth = false;
        }
      }
    });

    this.siteSettingService.getAllSettings().subscribe((data: any) => {
      let flag = data.find(
        (e: SiteSettings) => e.key === 'Show Packages Button'
      ).value;

      this.showPackages = flag.toLowerCase() === 'false' ? false : true;
    });
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

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const number =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    number >= 90 ? (this.isScrolled = true) : (this.isScrolled = false);
  }

  public get Type(): FormControl {
    return this.accountsForm.get('type') as FormControl;
  }

  navigateToForms() {
    if (this.accountsForm.valid) {
      if (this.Type.value == 'provider') {
        this.router.navigateByUrl('/auth/register/vendor-company');
      }

      if (this.Type.value == 'individual') {
        this.router.navigateByUrl('/auth/register/individual');
      }
    }
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.userSub.unsubscribe();
  }

  navigateToDash() {
    let role: string = this.user.role;

    if (role.includes('Company') && !role.includes('Vendor')) {
      this.router.navigate(['/company-dashboard/dash']);
    }

    if (role.includes('Company') && role.includes('Vendor')) {
      this.router.navigate(['/company-dashboard/dash']);
    }

    if (role.includes('Individual')) {
      this.router.navigate(['/company-dashboard/dash']);
    }
  }
}
