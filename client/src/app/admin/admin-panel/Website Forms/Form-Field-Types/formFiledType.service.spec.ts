/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormFiledTypeService } from './formFiledType.service';

describe('Service: FormFiledType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormFiledTypeService]
    });
  });

  it('should ...', inject([FormFiledTypeService], (service: FormFiledTypeService) => {
    expect(service).toBeTruthy();
  }));
});
