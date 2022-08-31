/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AttachCompanyService } from './attachCompany.service';

describe('Service: AttachCompany', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AttachCompanyService]
    });
  });

  it('should ...', inject([AttachCompanyService], (service: AttachCompanyService) => {
    expect(service).toBeTruthy();
  }));
});
