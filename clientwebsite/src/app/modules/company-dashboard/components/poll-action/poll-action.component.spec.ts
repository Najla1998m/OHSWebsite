/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PollActionComponent } from './poll-action.component';

describe('PollActionComponent', () => {
  let component: PollActionComponent;
  let fixture: ComponentFixture<PollActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PollActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PollActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
