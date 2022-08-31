import { Component, ErrorHandler, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';

import { SiteInfo } from 'src/app/modules/shared/models/site-info';
import { SiteSettings } from 'src/app/modules/shared/models/site-settings';
import Swal from 'sweetalert2';
import { SiteSettingsService } from '../../services/site-settings.service';
import { MessageService } from './message.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  siteInfo!: SiteInfo;
  secondaryTheme = false;
  contactForm!: FormGroup;
  makeItFixed = false;
  policy!: any;
  terms!: any;
  social!: SiteSettings[];
  date = new Date();

  @ViewChild(FormGroupDirective) form: FormGroupDirective | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private siteService: SiteSettingsService,
    private messageService: MessageService,
    private errorHandler: ErrorHandler
  ) {
    this.contactForm = this.fb.group({
      username: [
        null,
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
      ],
      mobile: [null, [Validators.required]],
      email: [
        null,
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      message: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.siteService.GetSettingInfo().subscribe((info: any) => {
      this.siteInfo = info;
    });

    this.siteService
      .getWebsitePolicyAndGeneralTerms()
      .subscribe((data: any) => {
        this.policy = data.find((e: any) => e.key == 'Website_Policy');
        this.terms = data.find((e: any) => e.key == 'General Terms');
      });

    this.siteService
      .GetSettingBySettingType('SocialLink')
      .subscribe((data: any) => {
        this.social = [...data];
      });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url) {
        if (!event.url.includes('home') && !(event.url.split('/')[1] == '')) {
          this.secondaryTheme = true;
        } else {
          this.secondaryTheme = false;
        }
      }
    });
  }

  public get CompanyName(): FormControl {
    return this.contactForm.get('username') as FormControl;
  }
  public get Phone(): FormControl {
    return this.contactForm.get('mobile') as FormControl;
  }
  public get Email(): FormControl {
    return this.contactForm.get('email') as FormControl;
  }
  public get Message(): FormControl {
    return this.contactForm.get('message') as FormControl;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.messageService.sendMessage(this.contactForm.value).subscribe(
        () => {
          Swal.fire('تم الأرسال بنجاح', '', 'success');
          this.form?.resetForm();
        },
        (error) => {
          this.errorHandler.handleError(error);
        }
      );
    }
  }
}
