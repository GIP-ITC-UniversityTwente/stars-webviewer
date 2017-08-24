import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AppConfiguration } from '../app-configuration';

import { AuthService } from '../services/auth.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class StarsAPIService {

  /**
   * Utility for creating the authorization header
   */
  static createAuthorizationHeader() {
    const token = localStorage.getItem('id_token');
    const authHeader = new Headers();
    authHeader.append('content-type', 'application/x-www-form-urlencode');
    authHeader.append('Authorization', 'Bearer ' + token);
    return authHeader;
  }

  /**
   * Service Life-cycle methods
   */
  constructor(private http: Http, public auth: AuthService) {
  }

  /**
   * Fetches study areas
   */
  fetchStudyAreas(): Promise<any> {
    const authHeader = StarsAPIService.createAuthorizationHeader();
    const url = AppConfiguration.apiBaseURL + '/studyareas';
    return this.http.get(url, { headers: authHeader })
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
        if (error.name === 'Authorization required') {
          this.auth.login();
        }
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
    const authHeader = StarsAPIService.createAuthorizationHeader();
    let url = AppConfiguration.apiBaseURL + `/farmfields?studyAreaId=${studyAreaId}&startYear=${startYear}`;
    if (endYear !== undefined) {
      url += `&endYear=${endYear}`;
    }

    return this.http.get(url, { headers: authHeader })
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
        if (error.name === 'Authorization required') {
          this.auth.login();
        }
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
    const authHeader = StarsAPIService.createAuthorizationHeader();
    let url = AppConfiguration.apiBaseURL + `/cropTypes?studyAreaId=${studyAreaId}&startYear=${startYear}`;
    if (endYear !== undefined) {
      url += `&endYear=${endYear}`;
    }

    return this.http.get(url, { headers: authHeader })
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
        if (error.name === 'Authorization required') {
          this.auth.login();
        }
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
    const authHeader = StarsAPIService.createAuthorizationHeader();
    let url = AppConfiguration.apiBaseURL + `/image/characteristics?studyAreaId=${studyAreaId}&startYear=${startYear}`;
    if (endYear !== undefined) {
      url += `&endYear=${endYear}`;
    }
    return this.http.get(url, { headers: authHeader })
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
        if (error.name === 'Authorization required') {
          this.auth.login();
        }
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
    const authHeader = StarsAPIService.createAuthorizationHeader();
    let url: string = AppConfiguration.apiBaseURL + `/image/timeseries?studyAreaId=${studyAreaId}&cropNames=${cropNames}&characteristicId=${characteristicId}&sensorList=${sensorList}&startYear=${startYear}`;
    if (endYear !== undefined) {
      url += `&endYear=${endYear}`;
    }
    if (firstParameter !== undefined) {
      url += `&firstParameter=${firstParameter}`;
    }
    if (secondParameter !== undefined) {
      url += `&secondParameter=${secondParameter}`;
    }

    return this.http.get(url, { headers: authHeader })
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
        if (error.name === 'Authorization required') {
          this.auth.login();
        }
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
    const authHeader = StarsAPIService.createAuthorizationHeader();
    let url = `${AppConfiguration.apiBaseURL}/field/characteristics?studyAreaId=${studyAreaId}&startYear=${startYear}`;
    if (endYear !== undefined) {
      url += `&endYear=${endYear}`;
    }

    return this.http.get(url, { headers: authHeader })
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
        if (error.name === 'Authorization required') {
          this.auth.login();
        }
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
    const authHeader = StarsAPIService.createAuthorizationHeader();
    let url = `${AppConfiguration.apiBaseURL}/field/timeseries?studyAreaId=${studyAreaId}&cropNames=${cropNames}&characteristicId=${characteristicId}&startYear=${startYear}`;
    if (endYear !== undefined) {
      url += `&endYear=${endYear}`;
    }

    return this.http.get(url, { headers: authHeader })
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
        if (error.name === 'Authorization required') {
          this.auth.login();
        }
      });
  }

  /**
   * Fetches a collection of field constant characteristics based on the input parameters.
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   */
  fetchFieldConstantCharacteristic(studyAreaId: number, startYear: number, endYear: number = undefined) {
    const authHeader = StarsAPIService.createAuthorizationHeader();
    let url = `${AppConfiguration.apiBaseURL}/field/constant_characteristics?studyAreaId=${studyAreaId}&startYear=${startYear}`;
    if (endYear !== undefined) {
      url += `&endYear=${endYear}`;
    }

    return this.http.get(url, { headers: authHeader })
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
        if (error.name === 'Authorization required') {
          this.auth.login();
        }
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
  fetchFieldConstantData(studyAreaId: number, startYear: number, endYear: number = undefined, characteristicId: number, cropNames: string) {
    const authHeader = StarsAPIService.createAuthorizationHeader();
    let url = `${AppConfiguration.apiBaseURL}/field/constant_data?studyAreaId=${studyAreaId}&characteristicId=${characteristicId}&cropNames=${cropNames}&startYear=${startYear}`;
    if (endYear !== undefined) {
      url += `&endYear=${endYear}`;
    }

    return this.http.get(url, { headers: authHeader })
      .toPromise()
      .then(response => response.json())
      .catch((error) => {
        console.log(error.message);
        if (error.name === 'Authorization required') {
          this.auth.login();
        }
      });
  }
}
