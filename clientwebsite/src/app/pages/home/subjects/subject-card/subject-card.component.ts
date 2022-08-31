import { Component, Input, OnInit } from '@angular/core';
import { StaticPages } from 'src/app/modules/shared/models/static-pages';

@Component({
  selector: 'app-subject-card',
  templateUrl: './subject-card.component.html',
  styleUrls: ['./subject-card.component.scss'],
})
export class SubjectCardComponent implements OnInit {
  @Input('data') data!: StaticPages;

  constructor() {}

  ngOnInit() {}
}
