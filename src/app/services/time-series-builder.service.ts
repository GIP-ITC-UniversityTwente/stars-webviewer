import { Injectable } from '@angular/core';

@Injectable()
export class TimeSeriesBuilderService {

  // standardizes the characteristic types a user can choose in the time series section
  static fetchCharacteristicTypes(): string[] {
    return ['Image Characteristic', 'Field Characteristic'];
  }

  // standardizes the image types a user can choose in the time series section
  static fetchImageTypes(): string[] {
    return ['Spectral', 'Textural'];
  }

  // Utility for creating a comma-delimited list of Crops from the input array
  static createCropList(crops: string[]): string {
    let cropList = '';
    crops.forEach(function(item, index) {
      if (index === crops.length - 1) {
        cropList += crops[index];
      } else {
        cropList += crops[index] + ',';
      }
    });
    return cropList;
  }

  constructor() { }

}
