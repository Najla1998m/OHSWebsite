import { Component, Input, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SiteSettingsService } from 'src/app/modules/core/services/site-settings.service';
import { SiteInfo } from 'src/app/modules/shared/models/site-info';

import { SlideBlock } from './header-card/slide-block';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  list: any[] = [null, null, null];
  siteInfo!: SiteInfo;
  MainSliderHeader!: any;
  bg!: string;
  constructor(private siteSettingService: SiteSettingsService) {}

  ngOnInit() {
    this.siteSettingService.GetSettingInfo().subscribe((data: any) => {
      this.siteInfo = data;
      localStorage.setItem('site', JSON.stringify(this.siteInfo));
      this.generateSlidesList(
        this.siteInfo.sliderTextList,
        this.siteInfo.sliderImagesList
      );
    });

    this.siteSettingService.getAllSettings().subscribe((data: any) => {
      this.MainSliderHeader = data.find(
        (e: any) => e.key == 'MainSliderHeader'
      );

      this.bg = data.find((e: any) => e.key == 'Home Image').value;
    });
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
    },
    nav: true,
  };

  generateSlidesList(titles: string[], images: string[]) {
    let slideList = [];
    for (let i = 0; i < titles.length; i++) {
      let slide: SlideBlock = { title: titles[i], image: images[i] };
      slideList.push(slide);
    }

    this.list = slideList;
  }
}
