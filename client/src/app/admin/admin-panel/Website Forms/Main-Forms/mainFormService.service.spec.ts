/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MainFormServiceService } from './mainFormService.service';

describe('Service: MainFormService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainFormServiceService]
    });
  });

  it('should ...', inject([MainFormServiceService], (service: MainFormServiceService) => {
    expect(service).toBeTruthy();
  }));
});
