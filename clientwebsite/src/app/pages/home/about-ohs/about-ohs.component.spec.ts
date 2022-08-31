/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AboutOhsComponent } from './about-ohs.component';

describe('AboutOhsComponent', () => {
  let component: AboutOhsComponent;
  let fixture: ComponentFixture<AboutOhsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AboutOhsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutOhsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
