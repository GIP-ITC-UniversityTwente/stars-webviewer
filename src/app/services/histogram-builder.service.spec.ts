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

  it('should be able to fetch up to five histogram colors', inject([HistogramBuilderService], (service: HistogramBuilderService) => {
    const expectedResult1 = '#A1D99B';
    const actualResult1 = HistogramBuilderService.fetchHistogramColorForIndex(0);
    expect(actualResult1).toBe(expectedResult1);

    const expectedResult2 = '#74C476';
    const actualResult2 = HistogramBuilderService.fetchHistogramColorForIndex(1);
    expect(actualResult2).toBe(expectedResult2);

    const expectedResult3 = '#41AB5D';
    const actualResult3 = HistogramBuilderService.fetchHistogramColorForIndex(2);
    expect(actualResult3).toBe(expectedResult3);

    const expectedResult4 = '#238B45';
    const actualResult4 = HistogramBuilderService.fetchHistogramColorForIndex(3);
    expect(actualResult4).toBe(expectedResult4);

    const expectedResult5 = '#005A32';
    const actualResult5 = HistogramBuilderService.fetchHistogramColorForIndex(4);
    expect(actualResult5).toBe(expectedResult5);
  }));

  it('should be able to fetch range of values (greater than or equal to start and less than end)', inject([HistogramBuilderService], (service: HistogramBuilderService) => {
    const sampleSeries = [10.2, 10.2, 11.2, 12.2, 13.2, 13.2, 14.2, 14.2, 14.2, 15.2];
    const startOfRange = 10.2;
    const endOfRange = 13.2;

    const expectedResult = [10.2, 10.2, 11.2, 12.2];
    const actualResult = HistogramBuilderService.fetchValuesInRange(sampleSeries, startOfRange, endOfRange);
    expect(actualResult).toEqual(expectedResult);
  }));

  it('should be able to fetch range of values (greater than or equal to start and less then or equal when last number)', inject([HistogramBuilderService], (service: HistogramBuilderService) => {
    const sampleSeries = [10.2, 10.2, 11.2, 12.2, 13.2, 13.2, 14.2, 14.2, 14.2, 15.2];
    const startOfRange = 14.2;
    const endOfRange = 15.2;

    const expectedResult = [14.2, 14.2, 14.2, 15.2];
    const actualResult = HistogramBuilderService.fetchValuesInRange(sampleSeries, startOfRange, endOfRange);
    expect(actualResult).toEqual(expectedResult);
  }));

  it('should create a Plotly data object for an un-classified histogram', inject([HistogramBuilderService], (service: HistogramBuilderService) => {
    const sampleSeries = [1, 2, 3, 4, 5, 6, 7, 8];
    const expectedResult = [{
      x: [1, 2, 3, 4, 5, 6, 7, 8],
      type: 'histogram'
    }];
    const actualResult = HistogramBuilderService.createUnclassifiedHistogramDataObject(sampleSeries);
    expect(actualResult).toEqual(expectedResult);
  }));

  it('should create a Plotly data object for a classified histogram', inject([HistogramBuilderService], (service: HistogramBuilderService) => {

    const sampleSeries = [4.826, 5.6604, 0.614, 1.53673, 2.27609, 3.34334, 3.3388, 3.5771, 3.27267, 1.97033];
    const sampleRanges = ['0.614 - 1.53673', '1.53673 - 2.27609', '2.27609 - 3.5771', '3.5771 - 4.826', '4.826 - 5.6604'];
    const expectedResult = [{
      'name': 'Class 0 (0.614-1.53673)',
      'x': [0.614],
      'type': 'histogram',
      'marker': {
        'color': '#A1D99B'
      }
    }, {
      'name': 'Class 1 (1.53673-2.27609)',
      'x': [1.53673, 1.97033],
      'type': 'histogram',
      'marker': {
        'color': '#74C476'
      }
    }, {
      'name': 'Class 2 (2.27609-3.5771)',
      'x': [2.27609, 3.34334, 3.3388, 3.27267],
      'type': 'histogram',
      'marker': {
        'color': '#41AB5D'
      }
    }, {
      'name': 'Class 3 (3.5771-4.826)',
      'x': [3.5771],
      'type': 'histogram',
      'marker': {
        'color': '#238B45'
      }
    }, {
      'name': 'Class 4 (4.826-5.6604)',
      'x': [4.826],
      'type': 'histogram',
      'marker': {
        'color': '#005A32'
      }
    }];
    const actualResult = HistogramBuilderService.createClassifiedHistogramDataObject(sampleSeries, sampleRanges);
    expect(actualResult).toEqual(expectedResult);
  }));

});
