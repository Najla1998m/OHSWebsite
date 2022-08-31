/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RejectReasonsServiceService } from './RejectReasonsService.service';

describe('Service: RejectReasonsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RejectReasonsServiceService]
    });
  });

  it('should ...', inject([RejectReasonsServiceService], (service: RejectReasonsServiceService) => {
    expect(service).toBeTruthy();
  }));
});
