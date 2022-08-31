import { Component, OnInit } from '@angular/core';
import { StaticPage } from '../../models/StaticPage';
import { StaticPageService } from './static-page.service';

@Component({
  selector: 'app-static-pages',
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.css'],
})
export class StaticPagesComponent implements OnInit {
  pages: StaticPage[];
  items!: any;
  constructor(private pageServ: StaticPageService) {}

  ngOnInit() {
    this.pageServ.getAllPages();
    this.pageServ.updates.subscribe((data) => {
      this.pages = [...data];
    });
  }
}
