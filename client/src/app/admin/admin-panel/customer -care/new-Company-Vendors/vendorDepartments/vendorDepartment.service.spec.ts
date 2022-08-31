/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VendorDepartmentService } from './vendorDepartment.service';

describe('Service: VendorDepartment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorDepartmentService]
    });
  });

  it('should ...', inject([VendorDepartmentService], (service: VendorDepartmentService) => {
    expect(service).toBeTruthy();
  }));
});
