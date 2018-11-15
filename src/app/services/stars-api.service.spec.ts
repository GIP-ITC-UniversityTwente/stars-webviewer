import { TestBed, inject } from '@angular/core/testing';

import { StarsAPIService } from './stars-api.service';
import {HttpModule} from '@angular/http';

describe('StarsAPIService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StarsAPIService],
      imports: [HttpModule]
    });
  });

  it('should be created', inject([StarsAPIService], (service: StarsAPIService) => {
    expect(service).toBeTruthy();
  }));
});
