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

  it('creates a comma-delimited crop list', inject([TimeSeriesBuilderService], (service: TimeSeriesBuilderService) => {
    const sampleList = ['Cotton', 'Groundnut', 'Maize'];
    const actualCropList = TimeSeriesBuilderService.createCropList(sampleList);
    const expectedCropList = 'Cotton,Groundnut,Maize';
    expect(actualCropList).toEqual(expectedCropList);
  }));

  it('will create a unique list of image characterisitcs', inject([TimeSeriesBuilderService], (service: TimeSeriesBuilderService) => {

    const sampleWebResponse = [
      {
        'oid': 1,
        'name': 'reflectance_zeroth_moment',
        'interpretation': 'The number of relevant spectral pixels spatially within the field, excluding cloud and tree-masked pixels',
        'sensor': 'GeoEye-1_MS',
        'variabletype': 's',
        'datatype': 'integer',
        'alias': '#pixels after masking'
      }, {
        'oid': 1,
        'name': 'reflectance_zeroth_moment',
        'interpretation': 'The number of relevant spectral pixels spatially within the field, excluding cloud and tree-masked pixels',
        'sensor': 'QuickBird_MS',
        'variabletype': 's',
        'datatype': 'integer',
        'alias': '#pixels after masking'
      }, {
        'oid': 1,
        'name': 'reflectance_zeroth_moment',
        'interpretation': 'The number of relevant spectral pixels spatially within the field, excluding cloud and tree-masked pixels',
        'sensor': 'WorldView-2_MS',
        'variabletype': 's',
        'datatype': 'integer',
        'alias': '#pixels after masking'
      }, {
        'oid': 2,
        'name': 'number_of_all_pixels',
        'interpretation': 'The number of spectral pixels spatially within the field, including those masked out because of clouds or trees',
        'sensor': 'GeoEye-1_MS',
        'variabletype': 's',
        'datatype': 'integer',
        'alias': '#pixels'
      }, {
        'oid': 2,
        'name': 'number_of_all_pixels',
        'interpretation': 'The number of spectral pixels spatially within the field, including those masked out because of clouds or trees',
        'sensor': 'QuickBird_MS',
        'variabletype': 's',
        'datatype': 'integer',
        'alias': '#pixels'
      }, {
        'oid': 2,
        'name': 'number_of_all_pixels',
        'interpretation': 'The number of spectral pixels spatially within the field, including those masked out because of clouds or trees',
        'sensor': 'WorldView-2_MS',
        'variabletype': 's',
        'datatype': 'integer',
        'alias': '#pixels'
      }
    ];
    const expectedUniqueCharacteristicNames = ['#pixels after masking', '#pixels'];
    const actualUniqueCharacteristicNames = TimeSeriesBuilderService.createUniqueCharacteristicNames(sampleWebResponse);
    expect(actualUniqueCharacteristicNames).toEqual(expectedUniqueCharacteristicNames);
  }));

  it('can look up correct characteristic id for an image characteristic alias', inject([TimeSeriesBuilderService], (service: TimeSeriesBuilderService) => {
    const sampleImageCharacteristics = [
      {
        'oid': 1,
        'name': 'reflectance_zeroth_moment',
        'sensor': 'GeoEye-1_MS',
        'alias': '#pixels after masking'
      }, {
        'oid': 2,
        'name': 'number_of_all_pixels',
        'interpretation': 'The number of spectral pixels spatially within the field, including those masked out because of clouds or trees',
        'sensor': 'GeoEye-1_MS',
        'variabletype': 's',
        'datatype': 'integer',
        'alias': '#pixels'
      }
    ];
    const actualCharacteristicId = TimeSeriesBuilderService.fetchImageCharacteristicId('#pixels', sampleImageCharacteristics);
    const expectedCharacteristicId = 2;
    expect(actualCharacteristicId).toEqual(expectedCharacteristicId);
  }));

  it('can look up correct sensors for an image characteristic alias', inject([TimeSeriesBuilderService], (service: TimeSeriesBuilderService) => {
    const sampleImageCharacteristics = [{
      'oid': 1,
      'name': 'reflectance_zeroth_moment',
      'interpretation': 'The number of relevant spectral pixels spatially within the field, excluding cloud and tree-masked pixels',
      'sensor': 'GeoEye-1_MS',
      'variabletype': 's',
      'datatype': 'integer',
      'alias': '#pixels after masking'
    }, {
      'oid': 1,
      'name': 'reflectance_zeroth_moment',
      'interpretation': 'The number of relevant spectral pixels spatially within the field, excluding cloud and tree-masked pixels',
      'sensor': 'QuickBird_MS',
      'variabletype': 's',
      'datatype': 'integer',
      'alias': '#pixels after masking'
    }, {
      'oid': 1,
      'name': 'reflectance_zeroth_moment',
      'interpretation': 'The number of relevant spectral pixels spatially within the field, excluding cloud and tree-masked pixels',
      'sensor': 'WorldView-2_MS',
      'variabletype': 's',
      'datatype': 'integer',
      'alias': '#pixels after masking'
    }, {
      'oid': 2,
      'name': 'number_of_all_pixels',
      'interpretation': 'The number of spectral pixels spatially within the field, including those masked out because of clouds or trees',
      'sensor': 'GeoEye-1_MS',
      'variabletype': 's',
      'datatype': 'integer',
      'alias': '#pixels'
    }, {
      'oid': 2,
      'name': 'number_of_all_pixels',
      'interpretation': 'The number of spectral pixels spatially within the field, including those masked out because of clouds or trees',
      'sensor': 'QuickBird_MS',
      'variabletype': 's',
      'datatype': 'integer',
      'alias': '#pixels'
    }, {
      'oid': 2,
      'name': 'number_of_all_pixels',
      'interpretation': 'The number of spectral pixels spatially within the field, including those masked out because of clouds or trees',
      'sensor': 'WorldView-2_MS',
      'variabletype': 's',
      'datatype': 'integer',
      'alias': '#pixels'
    }, {
      'oid': 3,
      'name': 'ndvi',
      'interpretation': 'Average of NDVI score over all relevant, within-field pixels',
      'sensor': 'GeoEye-1_MS',
      'variabletype': 's',
      'datatype': 'float',
      'alias': 'NDVI average'
    }, {
      'oid': 3,
      'name': 'ndvi',
      'interpretation': 'Average of NDVI score over all relevant, within-field pixels',
      'sensor': 'QuickBird_MS',
      'variabletype': 's',
      'datatype': 'float',
      'alias': 'NDVI average'
    }, {
      'oid': 3,
      'name': 'ndvi',
      'interpretation': 'Average of NDVI score over all relevant, within-field pixels',
      'sensor': 'WorldView-2_MS',
      'variabletype': 's',
      'datatype': 'float',
      'alias': 'NDVI average'
    }, {
      'oid': 4,
      'name': 'sd_ndvi',
      'interpretation': 'Standard deviation of NDVI values over all relevant, within-field pixels',
      'sensor': 'GeoEye-1_MS',
      'variabletype': 's',
      'datatype': 'float',
      'alias': 'NDVI variability'
    }, {
      'oid': 4,
      'name': 'sd_ndvi',
      'interpretation': 'Standard deviation of NDVI values over all relevant, within-field pixels',
      'sensor': 'QuickBird_MS',
      'variabletype': 's',
      'datatype': 'float',
      'alias': 'NDVI variability'
    }, {
      'oid': 4,
      'name': 'sd_ndvi',
      'interpretation': 'Standard deviation of NDVI values over all relevant, within-field pixels',
      'sensor': 'WorldView-2_MS',
      'variabletype': 's',
      'datatype': 'float',
      'alias': 'NDVI variability'
    }, {
      'oid': 5,
      'name': 'ndvi_green',
      'interpretation': 'Average of NDVI-green score over all relevant, within-field pixels',
      'sensor': 'GeoEye-1_MS',
      'variabletype': 's',
      'datatype': 'float',
      'alias': 'NDVI-green average'
    }, {
      'oid': 5,
      'name': 'ndvi_green',
      'interpretation': 'Average of NDVI-green score over all relevant, within-field pixels',
      'sensor': 'QuickBird_MS',
      'variabletype': 's',
      'datatype': 'float',
      'alias': 'NDVI-green average'
    }, {
      'oid': 5,
      'name': 'ndvi_green',
      'interpretation': 'Average of NDVI-green score over all relevant, within-field pixels',
      'sensor': 'WorldView-2_MS',
      'variabletype': 's',
      'datatype': 'float',
      'alias': 'NDVI-green average'
    }];
    const actualSensors = TimeSeriesBuilderService.fetchSensorsForImageCharacteristic('NDVI average', sampleImageCharacteristics);
    const expectedSensors = ['GeoEye-1_MS', 'QuickBird_MS', 'WorldView-2_MS'];
    expect(actualSensors).toEqual(expectedSensors);
  }));

  it('can fetch a color for time series plot from color palette', inject([TimeSeriesBuilderService], (service: TimeSeriesBuilderService) => {
    const allPotentialColors = ['#6A7f00', '#D26F51', '#D59F2E', '#00577F', '#C548C0'];
    const randomColor = TimeSeriesBuilderService.fetchTimeSeriesLineColor();
    expect(allPotentialColors.includes(randomColor)).toBe(true);
  }));

  it('can fetch complimentary color for time series plot envelope', inject([TimeSeriesBuilderService], (service: TimeSeriesBuilderService) => {
    const expectedComplimentaryColor = 'rgba(106, 127, 0, 0.2)';
    const actualComplimentaryColor = TimeSeriesBuilderService.fetchTimeSeriesEnvelopeColor('#6A7f00');
    expect(actualComplimentaryColor).toEqual(expectedComplimentaryColor);
  }));

  it('can create a time series data object', inject([TimeSeriesBuilderService], (service: TimeSeriesBuilderService) => {
    const sampleAPIResponse = {'message': 'success', 'results': [{'crop': 'Cotton', 'cseries': [{'sensor': 'GeoEye-1_MS', 'sseries': [{'acquisition_date': '2014-05-01', 'minvalue': 0.101019, 'avgvalue': 0.115096, 'maxvalue': 0.129173, 'n': 10}, {'acquisition_date': '2014-06-24', 'minvalue': 0.143023, 'avgvalue': 0.17811, 'maxvalue': 0.213197, 'n': 10}, {'acquisition_date': '2014-07-08', 'minvalue': 0.146259, 'avgvalue': 0.267699, 'maxvalue': 0.389139, 'n': 10}, {'acquisition_date': '2014-08-07', 'minvalue': 0.412239, 'avgvalue': 0.483405, 'maxvalue': 0.554571, 'n': 10}, {'acquisition_date': '2014-09-22', 'minvalue': 0.647752, 'avgvalue': 0.750959, 'maxvalue': 0.854166, 'n': 10}, {'acquisition_date': '2014-09-25', 'minvalue': 0.595742, 'avgvalue': 0.672339, 'maxvalue': 0.748936, 'n': 10}]}]}]};
    const timeSeriesDataObject = TimeSeriesBuilderService.createTimeSeriesDataObject(sampleAPIResponse);

    // two objects one object for the envelope and one for the line
    expect(timeSeriesDataObject.length).toEqual(2);
  }));

  it('can create a time series data object - has mode property of \'lines\' and type property of \'scatter\'', inject([TimeSeriesBuilderService], (service: TimeSeriesBuilderService) => {
    const sampleAPIResponse = {'message': 'success', 'results': [{'crop': 'Cotton', 'cseries': [{'sensor': 'GeoEye-1_MS', 'sseries': [{'acquisition_date': '2014-05-01', 'minvalue': 0.101019, 'avgvalue': 0.115096, 'maxvalue': 0.129173, 'n': 10}, {'acquisition_date': '2014-06-24', 'minvalue': 0.143023, 'avgvalue': 0.17811, 'maxvalue': 0.213197, 'n': 10}, {'acquisition_date': '2014-07-08', 'minvalue': 0.146259, 'avgvalue': 0.267699, 'maxvalue': 0.389139, 'n': 10}, {'acquisition_date': '2014-08-07', 'minvalue': 0.412239, 'avgvalue': 0.483405, 'maxvalue': 0.554571, 'n': 10}, {'acquisition_date': '2014-09-22', 'minvalue': 0.647752, 'avgvalue': 0.750959, 'maxvalue': 0.854166, 'n': 10}, {'acquisition_date': '2014-09-25', 'minvalue': 0.595742, 'avgvalue': 0.672339, 'maxvalue': 0.748936, 'n': 10}]}]}]};
    const timeSeriesDataObject = TimeSeriesBuilderService.createTimeSeriesDataObject(sampleAPIResponse);

    expect(timeSeriesDataObject[1].mode).toEqual('lines');
    expect(timeSeriesDataObject[1].type).toEqual('scatter');
  }));

  it('can create a time series data object - has an \'x\' property which represents an array of time values to plot along the x-axis', inject([TimeSeriesBuilderService], (service: TimeSeriesBuilderService) => {
    const sampleAPIResponse = {'message': 'success', 'results': [{'crop': 'Cotton', 'cseries': [{'sensor': 'GeoEye-1_MS', 'sseries': [{'acquisition_date': '2014-05-01', 'minvalue': 0.101019, 'avgvalue': 0.115096, 'maxvalue': 0.129173, 'n': 10}, {'acquisition_date': '2014-06-24', 'minvalue': 0.143023, 'avgvalue': 0.17811, 'maxvalue': 0.213197, 'n': 10}, {'acquisition_date': '2014-07-08', 'minvalue': 0.146259, 'avgvalue': 0.267699, 'maxvalue': 0.389139, 'n': 10}, {'acquisition_date': '2014-08-07', 'minvalue': 0.412239, 'avgvalue': 0.483405, 'maxvalue': 0.554571, 'n': 10}, {'acquisition_date': '2014-09-22', 'minvalue': 0.647752, 'avgvalue': 0.750959, 'maxvalue': 0.854166, 'n': 10}, {'acquisition_date': '2014-09-25', 'minvalue': 0.595742, 'avgvalue': 0.672339, 'maxvalue': 0.748936, 'n': 10}]}]}]};
    const timeSeriesDataObject = TimeSeriesBuilderService.createTimeSeriesDataObject(sampleAPIResponse);
    const expectedXValues = ["2014-05-01","2014-06-24","2014-07-08","2014-08-07","2014-09-22","2014-09-25","2014-09-25","2014-09-22","2014-08-07","2014-07-08","2014-06-24","2014-05-01"];

    expect(timeSeriesDataObject[1]['x'].length).toBeGreaterThan(0);
    expect(timeSeriesDataObject[1]['x']).toEqual(expectedXValues);
  }));

  it('can create a time series data object - has an \'y\' property which represents an array of values to plot along the y-axis', inject([TimeSeriesBuilderService], (service: TimeSeriesBuilderService) => {
    const sampleAPIResponse = {'message': 'success', 'results': [{'crop': 'Cotton', 'cseries': [{'sensor': 'GeoEye-1_MS', 'sseries': [{'acquisition_date': '2014-05-01', 'minvalue': 0.101019, 'avgvalue': 0.115096, 'maxvalue': 0.129173, 'n': 10}, {'acquisition_date': '2014-06-24', 'minvalue': 0.143023, 'avgvalue': 0.17811, 'maxvalue': 0.213197, 'n': 10}, {'acquisition_date': '2014-07-08', 'minvalue': 0.146259, 'avgvalue': 0.267699, 'maxvalue': 0.389139, 'n': 10}, {'acquisition_date': '2014-08-07', 'minvalue': 0.412239, 'avgvalue': 0.483405, 'maxvalue': 0.554571, 'n': 10}, {'acquisition_date': '2014-09-22', 'minvalue': 0.647752, 'avgvalue': 0.750959, 'maxvalue': 0.854166, 'n': 10}, {'acquisition_date': '2014-09-25', 'minvalue': 0.595742, 'avgvalue': 0.672339, 'maxvalue': 0.748936, 'n': 10}]}]}]};
    const timeSeriesDataObject = TimeSeriesBuilderService.createTimeSeriesDataObject(sampleAPIResponse);
    const expectedYValues = [0.115096,0.17811,0.267699,0.483405,0.750959,0.672339];
    expect(timeSeriesDataObject[1]['y'].length).toBeGreaterThan(0);
    expect(timeSeriesDataObject[1]['y']).toEqual(expectedYValues);
  }));

  });
