import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.scss'],
})
export class HintComponent implements OnInit {
  @Input('content') content!: any;
  @Input('hasAction') hasAction!: boolean;
  @Input('actionName') actionName!: string;
  @Output('onAction') onAction = new EventEmitter();

  hide: boolean = false;

  constructor() {}

  ngOnInit() {}

  onClick() {
    this.onAction.emit();

    this.hide = true;
  }
}
