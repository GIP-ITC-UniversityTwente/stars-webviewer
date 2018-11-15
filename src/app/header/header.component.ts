import { Component, OnInit } from '@angular/core';

import { AppConfiguration } from '../app-configuration';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  /**
   * Properties
   */
  title = 'Crop Spectrotemporal Signature Library';

  /**
   * For depedency injecting AuthService
   */
  constructor(public auth: AuthService) { }

  /**
   * Life-cycle hook after component is created.
   */
  ngOnInit() {}

  /**
   * For handling when user taps on the help button.
   */
  handleHelpButtonTap() {
    window.open(AppConfiguration.onlineHelpURL, '_newtab');
  }

  /**
   * For handling when user taps on the login/logout button.
   */
  handleLogoutButtonTap() {
    this.auth.logout();
  }
}
