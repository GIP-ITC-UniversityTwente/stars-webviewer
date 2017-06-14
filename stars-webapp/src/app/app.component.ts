import { Component } from '@angular/core';
import { StarsAPIService } from './services/stars-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    StarsAPIService
  ]
})
export class AppComponent {

  /**
   * Component Life-cycle methods
   * @param starsAPIService - injects the STARS API service.
   */
  constructor(private starsAPIService: StarsAPIService) {

    // fetch the default data for first load ...

    starsAPIService.fetchStudyAreas().then((response) => {
      return response;
    }).then((data) => {
      console.log('test study areas ...');
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });

    starsAPIService.fetchCropTypes(1000, 2014).then((response) => {
      return response;
    }).then((data) => {
      console.log('test crop types one year ...');
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });

    starsAPIService.fetchCropTypes(1000, 2014, 2015).then((response) => {
      return response;
    }).then((data) => {
      console.log('test crop types two years ...');
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });
  }
}
