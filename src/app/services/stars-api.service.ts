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
      .catch(this.handleStudyAreasError);
  }

  private handleStudyAreasError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  /**
   * Fetches farm fields based on input study area, start year, and optional end year.
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   * @returns {Promise<any>}
   */
  fetchFarmFields(studyAreaId: number, startYear: number, endYear: number = null): Promise<any> {
    let url: string;
    if (endYear == null) {
      url = AppConfiguration.apiBaseURL + "/farmfields?studyAreaId=" + String(studyAreaId) + "&startYear=" + String(startYear);
    }
    else {
      url = AppConfiguration.apiBaseURL + "/farmfields?studyAreaId=" + String(studyAreaId) + "&startYear=" + String(startYear) + "&endYear=" + String(endYear);
    }
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleFarmfieldsError);
  }

  private handleFarmfieldsError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  /**
   * Fetches crop types for the input study area, start year, and optional end year.
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   * @returns {Promise<any>}
   */
  fetchCropTypes(studyAreaId: number, startYear: number, endYear: number = null): Promise<any> {
    let url: string;
    if (endYear == null) {
      url = AppConfiguration.apiBaseURL + "/cropTypes?studyAreaId=" + String(studyAreaId) + "&startYear=" + String(startYear);
    }
    else {
      url = AppConfiguration.apiBaseURL + "/cropTypes?studyAreaId=" + String(studyAreaId) + "&startYear=" + String(startYear) + "&endYear=" + String(endYear);
    }
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleCropTypesError);
  }

  private handleCropTypesError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  /**
   * Fetches image characteristics for the input study area, star year, and option end year.
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   * @returns {Promise<any>}
   */
  fetchImageCharacteristics(studyAreaId: number, startYear: number, endYear: number = null): Promise<any> {
    let url: string;
    if (endYear == null) {
      url = AppConfiguration.apiBaseURL + "/imagecharacteristics?studyAreaId=" + String(studyAreaId) + "&startYear=" + String(startYear);
    }
    else {
      url = AppConfiguration.apiBaseURL + "/imagecharacteristics?studyAreaId=" + String(studyAreaId) + "&startYear=" + String(startYear) + "&endYear=" + String(endYear);
    }
    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleImageCharacteristicsError);
  }

  private handleImageCharacteristicsError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
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
  fetchImageCharacteristicTimeSeries(studyAreaId: number, startYear: number, endYear: number = null, cropNames: string, characteristicId: number,  sensorList: string, firstParameter: number = null, secondParameter = null) {

    let url: string = AppConfiguration.apiBaseURL + "/timeseries?";

    url += "studyAreaId=" + studyAreaId;

    if (endYear == null) {
      url += "&startYear=" + String(startYear);
    }
    else {
      url += "&startYear=" + String(startYear) + "&endYear=" + String(endYear);
    }

    url += "&cropNames=" + cropNames;

    url += "&characteristicId=" + characteristicId;

    url += "&sensorList=" + sensorList;

    if (firstParameter != null) {
      url += "&firstParameter=" + firstParameter;
    }

    if (secondParameter != null) {
      url += "&secondParameter=" + secondParameter;
    }

    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleImageTimeSeriesError);
  }

  private handleImageTimeSeriesError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  /**
   * Fetches the field characteristics for the input study area and time.
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   * @returns {Promise<any | never | any>}
   */
  fetchFieldCharacteristics(studyAreaId: number, startYear: number, endYear: number = null) {

    let url: string = AppConfiguration.apiBaseURL + "/fieldcharacteristics?";

    url += "studyAreaId=" + studyAreaId;

    if (endYear == null) {
      url += "&startYear=" + String(startYear);
    }
    else {
      url += "&startYear=" + String(startYear) + "&endYear=" + String(endYear);
    }

    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleFieldCharacteristicError);
  }

  private handleFieldCharacteristicError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
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
  fetchFieldCharacteristicTimeSeries(studyAreaId: number, startYear: number, endYear: number = null, cropNames: string, characteristicId: number) {

    let url: string = AppConfiguration.apiBaseURL + "/timeseries?";

    url += "studyAreaId=" + studyAreaId;

    if (endYear == null) {
      url += "&startYear=" + String(startYear);
    }
    else {
      url += "&startYear=" + String(startYear) + "&endYear=" + String(endYear);
    }

    url += "&cropNames=" + cropNames;

    url += "&characteristicId=" + characteristicId;

    return this.http.get(url)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleFieldTimeSeriesError);
  }

  private handleFieldTimeSeriesError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
