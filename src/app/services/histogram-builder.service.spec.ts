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
    const targetColor1 = HistogramBuilderService.fetchHistogramColorForIndex(0);
    expect(targetColor1).toBe('#A1D99B');

    const targetColor2 = HistogramBuilderService.fetchHistogramColorForIndex(1);
    expect(targetColor2).toBe('#74C476');

    const targetColor3 = HistogramBuilderService.fetchHistogramColorForIndex(2);
    expect(targetColor3).toBe('#41AB5D');

    const targetColor4 = HistogramBuilderService.fetchHistogramColorForIndex(3);
    expect(targetColor4).toBe('#238B45');

    const targetColor5 = HistogramBuilderService.fetchHistogramColorForIndex(4);
    expect(targetColor5).toBe('#005A32');
  }));

  it('should be able to fetch range of values (greater than or equal to start and less than end)', inject([HistogramBuilderService], (service: HistogramBuilderService) => {
    const series = [10.2, 10.2, 11.2, 12.2, 13.2, 13.2, 14.2, 14.2, 14.2, 15.2];
    const startOfRange = 10.2;
    const endOfRange = 13.2;
    const valueUnderTest = HistogramBuilderService.fetchValuesInRange(series, startOfRange, endOfRange);
    expect(valueUnderTest).toEqual([10.2, 10.2, 11.2, 12.2]);
  }));

  it('should be able to fetch range of values (greather than or equal to start and less then or equal when last number)', inject([HistogramBuilderService], (service: HistogramBuilderService) => {
    const series = [10.2, 10.2, 11.2, 12.2, 13.2, 13.2, 14.2, 14.2, 14.2, 15.2];
    const startOfRange = 14.2;
    const endOfRange = 15.2;
    const valueUnderTest = HistogramBuilderService.fetchValuesInRange(series, startOfRange, endOfRange);
    expect(valueUnderTest).toEqual([14.2, 14.2, 14.2, 15.2]);
  }));

  it( 'should create a Plotly data object for an un-classified histogram)', inject([HistogramBuilderService], (service: HistogramBuilderService) => {
    const series = [1, 2, 3, 4, 5, 6, 7, 8];
    const expectedResult = [{
      x: [1, 2, 3, 4, 5, 6, 7, 8],
      type: 'histogram'
    }];
    const actualResult = HistogramBuilderService.createUnclassifiedHistogramDataObject(series);
    expect(actualResult).toEqual(expectedResult);
  }));

  it( 'should create a Plotly data object for a classified histogram)', inject([HistogramBuilderService], (service: HistogramBuilderService) => {

    const sampleSeries = [4.826, 5.6604, 0.614, 1.53673, 2.27609, 3.34334, 3.3388, 3.5771, 3.27267, 1.97033];
    const sampleRanges = ['0.614 - 1.53673', '1.53673 - 2.27609', '2.27609 - 3.5771', '3.5771 - 4.826', '4.826 - 5.6604'];

    // [{"name":"Class 0 (0.614-1.53673)","x":[0.614],"type":"histogram","marker":{"color":"#A1D99B"}},{"name":"Class 1 (1.53673-2.27609)","x":[1.53673,1.97033],"type":"histogram","marker":{"color":"#74C476"}},{"name":"Class 2 (2.27609-3.5771)","x":[2.27609,3.34334,3.3388,3.27267],"type":"histogram","marker":{"color":"#41AB5D"}},{"name":"Class 3 (3.5771-4.826)","x":[3.5771],"type":"histogram","marker":{"color":"#238B45"}},{"name":"Class 4 (4.826-5.6604)","x":[4.826],"type":"histogram","marker":{"color":"#005A32"}}]

    const expectedResult = [{
      x: [1, 2, 3, 4, 5, 6, 7, 8],
      type: 'histogram'
    }];
    const actualResult = HistogramBuilderService.createClassifiedHistogramDataObject(sampleSeries, sampleRanges);
    expect(actualResult).toEqual(expectedResult);
  }));

});
