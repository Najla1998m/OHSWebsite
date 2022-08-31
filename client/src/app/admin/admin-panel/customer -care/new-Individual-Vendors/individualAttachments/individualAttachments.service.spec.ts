/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { IndividualAttachmentsService } from './individualAttachments.service';

describe('Service: IndividualAttachments', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndividualAttachmentsService]
    });
  });

  it('should ...', inject([IndividualAttachmentsService], (service: IndividualAttachmentsService) => {
    expect(service).toBeTruthy();
  }));
});
