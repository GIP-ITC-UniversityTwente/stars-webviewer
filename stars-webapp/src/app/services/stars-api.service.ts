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
   * API methods
   */
  fetchStudyAreas(): Promise<any> {
    return this.http.get(AppConfiguration.apiBaseURL)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleStudyAreasError);
  }

  private handleStudyAreasError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
