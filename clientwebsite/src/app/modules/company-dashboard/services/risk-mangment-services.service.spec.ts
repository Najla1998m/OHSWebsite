/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RiskMangmentServicesService } from './risk-mangment-services.service';

describe('Service: RiskMangmentServices', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RiskMangmentServicesService]
    });
  });

  it('should ...', inject([RiskMangmentServicesService], (service: RiskMangmentServicesService) => {
    expect(service).toBeTruthy();
  }));
});
