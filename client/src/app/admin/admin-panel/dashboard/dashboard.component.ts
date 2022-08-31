import { Component, OnInit } from '@angular/core';
import { Department } from '../../models/Department';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  data: any;
  basicOptions: any;
  data2: any;
  data3: any;
  data4: any;
  lineStylesData!: any;
  listDepts: Department[] = [];
  listBar: any[] = [];
  listChart: any[] = [];
  selected: any;
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Number of Tasks';
  showYAxisLabel = true;
  yAxisLabel = 'Risk Level';
  selectedIndex: number = 0;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  };

  constructor(private dashService: DashboardService) {}

  ngOnInit(): void {
    this.dashService.getAllDepts().subscribe((res: any) => {
      this.listDepts = [...res];
      this.selected = res[0].id;

      this.dashService.getBar(this.selected).subscribe((res: any) => {
        console.log(res);

        this.listBar = [...res];
      });
      this.dashService.getChart(this.selected).subscribe((res: any) => {
        this.listChart = [...res];
      });
    });

    // this.listBar = [
    //   {
    //     name: 'Germany',
    //     value: 8940000,
    //   },
    //   {
    //     name: 'USA',
    //     value: 5000000,
    //   },
    //   {
    //     name: 'France',
    //     value: 7200000,
    //   },
    // ];

    // this.listChart = [
    //   {
    //     name: 'Germany',
    //     value: 8940000,
    //   },
    //   {
    //     name: 'USA',
    //     value: 5000000,
    //   },
    //   {
    //     name: 'France',
    //     value: 7200000,
    //   },
    //   {
    //     name: 'UK',
    //     value: 6200000,
    //   },
    //   {
    //     name: 'Italy',
    //     value: 4200000,
    //   },
    //   {
    //     name: 'Spain',
    //     value: 8200000,
    //   },
    // ];
  }

  loadChart(input: any) {
    let item = this.listDepts[input];
    this.dashService.getBar(item.id).subscribe((res: any) => {
      console.log(res);

      this.listBar = [...res];
    });

    this.dashService.getChart(item.id).subscribe((res: any) => {
      this.listChart = [...res];
    });
  }
}
