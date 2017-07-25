import { TestBed, inject } from '@angular/core/testing';

import { TimeSeriesBuilderService } from './time-series-builder.service';

describe('TimeSeriesBuilderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeSeriesBuilderService]
    });
  });

  it('should be created', inject([TimeSeriesBuilderService], (service: TimeSeriesBuilderService) => {
    expect(service).toBeTruthy();
  }));

  it('should fetch characteristic types', inject([TimeSeriesBuilderService], (service: TimeSeriesBuilderService) => {
    const characteristicTypes = TimeSeriesBuilderService.fetchCharacteristicTypes();

    const expectedImageType = 'Image Characteristic';
    const actualImageType = characteristicTypes[0];
    expect(expectedImageType).toEqual(actualImageType);

    const expectedFieldType = 'Field Characteristic';
    const actualFieldType = characteristicTypes[1];
    expect(expectedFieldType).toEqual(actualFieldType);
  }));

  it ('creates a comma-delimited crop list', inject([TimeSeriesBuilderService], (service: TimeSeriesBuilderService) => {
    const sampleList = ['Cotton', 'Groundnut', 'Maize'];
    const actualCropList = TimeSeriesBuilderService.createCropList(sampleList);
    const expectedCropList = 'Cotton,Groundnut,Maize';
    expect(actualCropList).toEqual(expectedCropList);
  }));

});
