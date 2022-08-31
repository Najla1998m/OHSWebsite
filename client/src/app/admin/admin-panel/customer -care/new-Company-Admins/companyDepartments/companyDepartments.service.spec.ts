/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CompanyDepartmentsService } from './companyDepartments.service';

describe('Service: CompanyDepartments', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompanyDepartmentsService]
    });
  });

  it('should ...', inject([CompanyDepartmentsService], (service: CompanyDepartmentsService) => {
    expect(service).toBeTruthy();
  }));
});
