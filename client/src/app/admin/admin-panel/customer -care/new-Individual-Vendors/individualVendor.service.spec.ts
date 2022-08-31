/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IndividualVendorService } from './individualVendor.service';

describe('Service: IndividualVendor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndividualVendorService]
    });
  });

  it('should ...', inject([IndividualVendorService], (service: IndividualVendorService) => {
    expect(service).toBeTruthy();
  }));
});
