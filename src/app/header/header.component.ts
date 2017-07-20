import { Component, OnInit } from '@angular/core';
import { AppConfiguration } from "../app-configuration";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  /**
   * Properties
   */

  title = "Crop Spectrotemporal Signature Library";
  helpIsVisible = false;

  /**
   * Lifecycle Methods
   */

  constructor() { }

  ngOnInit() { }

  /**
   * Event Handlers
   */

  handleHelpButtonTap() {
    window.open(AppConfiguration.onlineHelpURL,'_newtab');
  }

  handleLoginButtonTap() {
    console.log('login button tapped');
  }
}
