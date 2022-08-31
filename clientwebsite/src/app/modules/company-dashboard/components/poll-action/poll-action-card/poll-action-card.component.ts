import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-poll-action-card',
  templateUrl: './poll-action-card.component.html',
  styleUrls: ['./poll-action-card.component.scss'],
})
export class PollActionCardComponent implements OnInit {
  @Input('data') data!: { id: number; name: string };
  @Input('disabled') disabled: boolean = false;
  @Input('selected') selected: boolean = false;
  @Output('support') support = new EventEmitter();
  @Output('info') info = new EventEmitter();
  @Output('task') task = new EventEmitter();

  constructor() {
    console.log(this.data);
  }

  ngOnInit() {}

  onSupportClicked() {
    this.support.emit();
  }

  onInfoClicked() {
    this.info.emit();
  }

  onTaskClicked() {
    this.task.emit();
  }
}
