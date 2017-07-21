import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AppConfiguration } from '../app-configuration';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class StarsAPIService {

  /**
   * Properties
   */
  private http: Http;

  /**
   * Service Life-cycle methods
   */
  constructor(http: Http) {
    this.http = http;
  }

  /**
   * Fetches study areas
   */
  fetchStudyAreas(): Promise<any> {
    let url = AppConfiguration.apiBaseURL + "/studyareas";
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
      });
  }

  /**
   * Fetches farm fields based on input study area, start year, and optional end year.
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   * @returns {Promise<any>}
   */
  fetchFarmFields(studyAreaId: number, startYear: number, endYear: number = undefined): Promise<any> {
    let url = AppConfiguration.apiBaseURL + `/farmfields?studyAreaId=${studyAreaId}&startYear=${startYear}`;
    if (endYear != undefined) {
      url += `&endYear=${endYear}`;
    }

    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
      });
  }

  /**
   * Fetches crop types for the input study area, start year, and optional end year.
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   * @returns {Promise<any>}
   */
  fetchCropTypes(studyAreaId: number, startYear: number, endYear: number = undefined): Promise<any> {
    let url = AppConfiguration.apiBaseURL + `/cropTypes?studyAreaId=${studyAreaId}&startYear=${startYear}`;
    if (endYear != undefined) {
      url += `&endYear=${endYear}`;
    }

    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
      });
  }

  /**
   * Fetches image characteristics for the input study area, star year, and option end year.
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   * @returns {Promise<any>}
   */
  fetchImageCharacteristics(studyAreaId: number, startYear: number, endYear: number = undefined): Promise<any> {
    let url = AppConfiguration.apiBaseURL + `/imagecharacteristics?studyAreaId=${studyAreaId}&startYear=${startYear}`;
    if (endYear != undefined) {
      url += `&endYear=${endYear}`
    }
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
      });
  }

  /**
   * Fetches a time series for an image characteristic based on the input parameters.
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   * @param {string} cropNames
   * @param {number} characteristicId
   * @param {string} sensorList
   * @param {number} firstParameter
   * @param {any} secondParameter
   * @returns {Promise<any | never | any>}
   */
  fetchImageCharacteristicTimeSeries(studyAreaId: number, startYear: number, endYear: number = undefined, cropNames: string, characteristicId: number,  sensorList: string, firstParameter: number = undefined, secondParameter: number = undefined) {
    let url: string = AppConfiguration.apiBaseURL + `/timeseries?studyAreaId=${studyAreaId}&cropNames=${cropNames}&characteristicId=${characteristicId}&sensorList=${sensorList}&startYear=${startYear}`;
    if (endYear != undefined) {
      url += `&endYear=${endYear}`
    }
    if (firstParameter != undefined) {
      url += `&firstParameter=${firstParameter}`;
    }
    if (secondParameter != undefined) {
      url += `&secondParameter=${secondParameter}`;
    }

    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
      });
  }

  /**
   * Fetches the field characteristics for the input study area and time.
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   * @returns {Promise<any | never | any>}
   */
  fetchFieldCharacteristics(studyAreaId: number, startYear: number, endYear: number = undefined) {
    let url = `${AppConfiguration.apiBaseURL}/fieldcharacteristics?studyAreaId=${studyAreaId}&startYear=${startYear}`;
    if (endYear != undefined) {
      url += `&endYear=${endYear}`;
    }

    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
      });
  }

  /**
   * Fetches a time series for a field characteristic based on the input parameters.
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   * @param {string} cropNames
   * @param {number} characteristicId
   * @returns {Promise<any | never | any>}
   */
  fetchFieldCharacteristicTimeSeries(studyAreaId: number, startYear: number, endYear: number = undefined, cropNames: string, characteristicId: number) {
    let url = `${AppConfiguration.apiBaseURL}/timeseries?studyAreaId=${studyAreaId}&cropNames=${cropNames}&characteristicId=${characteristicId}&startYear=${startYear}`
    if (endYear != undefined) {
      url += `&endYear=${endYear}`;
    }

    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
      });
  }

  /**
   * Fetches a collection of field constant characteristics based on the input parameters.
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   */
  fetchFieldConstantCharacteristic(studyAreaId: number, startYear: number, endYear: number = undefined) {
    let url = `${AppConfiguration.apiBaseURL}/field/constant_characteristics?studyAreaId=${studyAreaId}&startYear=${startYear}`;
    if (endYear != undefined) {
      url += `&endYear=${endYear}`;
    }

    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
      });
  }

  /**
   * Fetches a collection of field constant data based on the input parameters.
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   * @param {number} characteristicId
   * @returns {Promise<never | any>}
   */
  fetchFieldConstantData(studyAreaId: number, startYear: number, endYear: number = undefined, characteristicId: number) {
    let url = `${AppConfiguration.apiBaseURL}/field/constant_data?studyAreaId=${studyAreaId}&characteristicId=${characteristicId}&startYear=${startYear}`;
    if (endYear != undefined) {
      url += `endYear=${endYear}`;
    }

    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
      });
  }
}
