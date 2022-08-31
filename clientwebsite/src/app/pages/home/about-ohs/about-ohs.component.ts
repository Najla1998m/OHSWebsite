import { Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ClientsService } from 'src/app/modules/core/services/clients.service';
import { SiteSettingsService } from 'src/app/modules/core/services/site-settings.service';
import { StaticPagesService } from 'src/app/modules/core/services/static-pages.service';
import { Clients } from 'src/app/modules/shared/models/clients';
import { DashboardInfo } from 'src/app/modules/shared/models/dashboardInfo';
import { SiteInfo } from 'src/app/modules/shared/models/site-info';
import { SiteSettings } from 'src/app/modules/shared/models/site-settings';
import { StaticPages } from 'src/app/modules/shared/models/static-pages';
declare var $: any;

@Component({
  selector: 'app-about-ohs',
  templateUrl: './about-ohs.component.html',
  styleUrls: ['./about-ohs.component.scss'],
})
export class AboutOhsComponent implements OnInit {
  page!: StaticPages;
  siteInfo!: SiteInfo;
  isLoading: boolean = true;
  dashInfo!: DashboardInfo;
  // @Input('video-src') video!: SiteSettings;
  clients!: Clients[];
  websiteDesc!: string;
  imageCover!: string;
  more!: string;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    autoHeight: true,
    autoplay: true,
    rtl: true,
    nav: false,
    margin: 15,
    lazyLoad: true,

    responsive: {
      0: {
        items: 2,
      },
      500: {
        items: 3,
      },
      1000: {
        items: 6,
      },
    },
  };

  constructor(
    private clientsServices: ClientsService,
    private siteServices: SiteSettingsService,
    private staticPagesService: StaticPagesService
  ) {}

  ngOnInit() {
   

   

    this.siteServices.getAllSettings().subscribe((data: any) => {
      this.websiteDesc = data.find(
        (e: any) => e.key == 'Website Description'
      ).value;
      this.imageCover = data.find(
        (e: any) => e.key == 'Youtube Thumbnail Image'
      ).value;

      this.more = data.find((e: any) => e.key == 'Main Content URL BTN').value;
      let s = this.more.split('/');
      this.more = s[s.length - 1];

      this.siteServices.GetSettingInfo().subscribe((data: any) => {
        this.siteInfo = data;
        data;
  
        this.getVideos(
          this.siteInfo.videoURL
            ? this.siteInfo.videoURL
            : 'https://www.youtube.com/embed/2aeXqUD4f8s'
        );
      });
      
      this.staticPagesService.getPageById(+this.more).subscribe((data: any) => {
        this.page = data;
        data;
      });
    });

    this.clientsServices.getAllClients();
    this.clientsServices.getUpdates().subscribe((data) => {
      this.clients = [...data];
      if (this.clients.length != 0) {
        if (this.clients.length < 6) {
          while (this.clients.length < 6) {
            this.clients.push({
              id: this.clients[this.clients.length - 1].id + 1,
              image: 'assets/images/home/img-defualt.jpg',
              imageName: 'dummy',
              isDeleted: false,
              isVisible: false,
              name: 'dummy',
              order: 2,
            });
          }
        }
      }
    });

    this.siteServices.GetDashboardInfo().subscribe((data: any) => {
      this.dashInfo = data;
    });
  }

  getVideos(video: string) {
    debugger;
    let v = document.getElementsByClassName('youtube-player');
    for (let n = 0; n < v.length; n++) {
      let p = document.createElement('div');
      let id = v[n].getAttribute('data-id');

      let placeholder: any = v[n].hasAttribute('data-thumbnail')
        ? v[n].getAttribute('data-thumbnail')
        : '';

      p.innerHTML = this.createCustomThumbail(placeholder);

      v[n].appendChild(p);
      p.addEventListener('click', function () {
        let parent: any = this.parentNode;

        AboutOhsComponent.createIframe(
          parent,
          parent.getAttribute('data-id'),
          video
        );
      });
    }
  }

  createCustomThumbail(url: any) {
    return (
      '<img class="img-fluid" src="' +
      url +
      '" alt="Youtube Preview" /><div class="youtube-play-btn"></div>'
    );
  }

  static createIframe(v: any, id: any, url: string) {
    let iframe = document.createElement('iframe');
    iframe.setAttribute('src', url);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('class', 'w-100');
    iframe.setAttribute('height', '300');
    v.firstChild.replaceWith(iframe);
  }
}
