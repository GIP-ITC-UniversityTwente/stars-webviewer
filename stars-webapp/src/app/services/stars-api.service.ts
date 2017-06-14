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
   * Fetches crop types for the input study area and year
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
}
