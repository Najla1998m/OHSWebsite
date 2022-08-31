/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IndividualRegisterComponent } from './individual-register.component';

describe('IndividualRegisterComponent', () => {
  let component: IndividualRegisterComponent;
  let fixture: ComponentFixture<IndividualRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IndividualRegisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
