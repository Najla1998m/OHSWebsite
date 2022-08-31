/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CompanyAdminService } from './companyAdmin.service';

describe('Service: CompanyAdmin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyAdminService]
    });
  });

  it('should ...', inject([CompanyAdminService], (service: CompanyAdminService) => {
    expect(service).toBeTruthy();
  }));
});
