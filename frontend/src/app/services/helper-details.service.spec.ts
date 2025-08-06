import { TestBed } from '@angular/core/testing';

import { HelperDetailsService } from './helper-details.service';

describe('HelperDetailsService', () => {
  let service: HelperDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelperDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
