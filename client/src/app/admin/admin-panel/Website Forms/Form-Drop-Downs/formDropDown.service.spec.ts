/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormDropDownService } from './formDropDown.service';

describe('Service: FormDropDownService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormDropDownService],
    });
  });

  it('should ...', inject(
    [FormDropDownService],
    (service: FormDropDownService) => {
      expect(service).toBeTruthy();
    }
  ));
});
