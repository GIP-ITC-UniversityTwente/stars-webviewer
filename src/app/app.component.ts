import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';
import { StarsAPIService } from './services/stars-api.service';
import { UserSelectionService } from './services/user-selection.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    StarsAPIService, UserSelectionService
  ]
})
export class AppComponent {

  /**
   * Component Life-cycle methods
   */
  constructor(public auth: AuthService) {
    auth.handleAuthentication();
  }
}
