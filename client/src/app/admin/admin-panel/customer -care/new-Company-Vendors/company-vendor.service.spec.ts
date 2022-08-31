/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CompanyVendorService } from './company-vendor.service';

describe('Service: CompanyVendor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyVendorService]
    });
  });

  it('should ...', inject([CompanyVendorService], (service: CompanyVendorService) => {
    expect(service).toBeTruthy();
  }));
});
