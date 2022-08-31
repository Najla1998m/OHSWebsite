import { Component, OnInit } from '@angular/core';
import { SiteInfo } from 'src/app/modules/shared/models/site-info';
import { Package } from './package';
import { PackageCriteria } from './package-criteria';
import { PackagesService } from './packages.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss'],
})
export class PackagesComponent implements OnInit {
  packages!: Package[];
  packageCriteria!: PackageCriteria[];
  siteInfo!: SiteInfo;

  constructor(private packagesService: PackagesService) {
    this.siteInfo = JSON.parse(localStorage.getItem('site')!);
  }

  ngOnInit() {
    this.packagesService.getPackageCriteria().subscribe((data) => {
      this.packageCriteria = [...data];
    });

    this.packagesService.getAllPackages().subscribe((data) => {
      this.packages = [...data];
    });
  }
}
