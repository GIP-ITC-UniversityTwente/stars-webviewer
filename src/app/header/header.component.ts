import { Component, OnInit } from '@angular/core';

import { AppConfiguration } from '../app-configuration';

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
  handleLoginButtonTap() {
    console.log('login button tapped');
  }
}
