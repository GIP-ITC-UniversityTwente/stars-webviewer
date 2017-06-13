import { Component, OnInit } from '@angular/core';

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

  /**
   * Lifecycle Methods
   */
  constructor() { }

  ngOnInit() { }
}
