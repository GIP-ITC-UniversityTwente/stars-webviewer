import { TestBed, inject } from '@angular/core/testing';

import { UserSelectionService } from './user-selection.service';

describe('UserSelectionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserSelectionService]
    });
  });

  it('should be created', inject([UserSelectionService], (service: UserSelectionService) => {
    expect(service).toBeTruthy();
  }));
});
