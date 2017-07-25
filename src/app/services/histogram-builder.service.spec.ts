import { TestBed, inject } from '@angular/core/testing';

import { HistogramBuilderService } from './histogram-builder.service';

describe('HistogramBuilderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistogramBuilderService]
    });
  });

  it('should be created', inject([HistogramBuilderService], (service: HistogramBuilderService) => {
    expect(service).toBeTruthy();
  }));
});
