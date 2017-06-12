import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  /**
   * Properties
   */

  title = "Crop Spectrotemporal Signature Library";
  description = "The objective of the Crop Spectrotemporal Signature Library (CSSL) is to serve as a functional information container for spectral information on crops and cropping systems, as they progress through the growing season. To this end, the system stores spectral data obtained at stated moments in time over data acquisition targets such as farm management units, together with ground reference data obtained from in situ observations and measurements from those same targets.";

  /**
   * Lifecylce Methods
   */
  constructor() { }

  ngOnInit() {
  }

}
