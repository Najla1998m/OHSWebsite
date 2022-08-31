/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MangementServiceService } from './mangementService.service';

describe('Service: MangementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MangementServiceService]
    });
  });

  it('should ...', inject([MangementServiceService], (service: MangementServiceService) => {
    expect(service).toBeTruthy();
  }));
});
