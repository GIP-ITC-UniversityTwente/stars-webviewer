import { TestBed, inject } from '@angular/core/testing';

import { StarsAPIService } from './stars-api.service';

describe('StarsAPIService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StarsAPIService]
    });
  });

  it('should be created', inject([StarsAPIService], (service: StarsAPIService) => {
    expect(service).toBeTruthy();
  }));
});
