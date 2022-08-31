import { Component, Input, OnInit } from '@angular/core';
import { SlideBlock } from './slide-block';

@Component({
  selector: 'app-header-card',
  templateUrl: './header-card.component.html',
  styleUrls: ['./header-card.component.scss'],
})
export class HeaderCardComponent implements OnInit {
  @Input('data') data!: SlideBlock;

  constructor() {}

  ngOnInit() {}
}
