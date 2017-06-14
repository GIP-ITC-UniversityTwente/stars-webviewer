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
    starsAPIService.fetchStudyAreas().then((response) => {
      return response;
    }).then((data) => {
      console.log('see study areas here ...');
      console.log(data);
    }).catch((error) => {
      console.log(error);
    })
  }
}
