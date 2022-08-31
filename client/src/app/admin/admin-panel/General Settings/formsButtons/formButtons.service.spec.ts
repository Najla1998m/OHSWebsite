/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FormButtonsService } from './formButtons.service';

describe('Service: FormButtons', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormButtonsService]
    });
  });

  it('should ...', inject([FormButtonsService], (service: FormButtonsService) => {
    expect(service).toBeTruthy();
  }));
});
