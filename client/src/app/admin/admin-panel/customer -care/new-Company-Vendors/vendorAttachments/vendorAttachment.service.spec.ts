/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VendorAttachmentService } from './vendorAttachment.service';

describe('Service: VendorAttachment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VendorAttachmentService]
    });
  });

  it('should ...', inject([VendorAttachmentService], (service: VendorAttachmentService) => {
    expect(service).toBeTruthy();
  }));
});
