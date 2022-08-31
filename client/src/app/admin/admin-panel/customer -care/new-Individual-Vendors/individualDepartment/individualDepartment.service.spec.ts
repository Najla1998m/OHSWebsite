/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IndividualDepartmentService } from './individualDepartment.service';

describe('Service: IndividualDepartment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndividualDepartmentService]
    });
  });

  it('should ...', inject([IndividualDepartmentService], (service: IndividualDepartmentService) => {
    expect(service).toBeTruthy();
  }));
});
