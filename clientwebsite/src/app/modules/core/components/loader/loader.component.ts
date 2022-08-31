import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  loading!: boolean;

  constructor(
    private loaderService: LoaderService,
    private spinner: NgxSpinnerService
  ) {
    this.loaderService.isLoading.subscribe((v) => {
      this.loading = v;
      if (v) this.spinner.show();
      else this.spinner.hide();
    });
  }

  ngOnInit(): void {}
}
