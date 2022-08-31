import { Component, Input, OnInit } from '@angular/core';

enum types {
  'Text' = 1,
  'Bool' = 2,
}

@Component({
  selector: 'app-package-card',
  templateUrl: './package-card.component.html',
  styleUrls: ['./package-card.component.scss'],
})
export class PackageCardComponent implements OnInit {
  @Input('data') data!: any;
  val: number = 10;

  type = types;

  data2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  constructor() {}

  ngOnInit() {}

  // getValue(input: any) {
  //   return this.data.packageDetails.find((e: any) => e.name == input)?.value;
  // }
}
