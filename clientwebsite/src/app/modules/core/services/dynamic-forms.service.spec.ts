/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DynamicFormsService } from './dynamic-forms.service';

describe('Service: DynamicForms', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicFormsService]
    });
  });

  it('should ...', inject([DynamicFormsService], (service: DynamicFormsService) => {
    expect(service).toBeTruthy();
  }));
});
