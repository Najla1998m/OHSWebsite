import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from '../shared/services/loaderService.service';

@Component({
  selector: 'app-my-loader',
  templateUrl: './my-loader.component.html',
  styleUrls: ['./my-loader.component.css']
})
export class MyLoaderComponent implements OnInit {
  loading: boolean;

  constructor(private loaderService: LoaderService,
    private spinner: NgxSpinnerService) {
      this.loaderService.isLoading.subscribe((v) => {
        // console.log(v);
        this.loading = v;
        if (v) this.spinner.show();
        else this.spinner.hide();
      });
     }

  ngOnInit(): void {
    
  }

}
