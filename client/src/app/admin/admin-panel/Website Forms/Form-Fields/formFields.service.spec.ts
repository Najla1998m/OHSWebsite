/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormFieldsService } from './formFields.service';

describe('Service: FormFields', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormFieldsService]
    });
  });

  it('should ...', inject([FormFieldsService], (service: FormFieldsService) => {
    expect(service).toBeTruthy();
  }));
});
