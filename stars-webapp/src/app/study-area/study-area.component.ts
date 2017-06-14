import { Component, OnInit } from '@angular/core';
import { AppConfiguration } from '../app-configuration';

// reference to leaflet
declare let L: any;

@Component({
  selector: 'app-study-area',
  templateUrl: './study-area.component.html',
  styleUrls: ['./study-area.component.css']
})
export class StudyAreaComponent implements OnInit {

  /**
    Properties
   */

  map: any;

  selectedStudyArea = "";
  studyAreas = [
    {value: 'studyArea1', viewValue: 'Study Area 1'},
    {value: 'studyArea2', viewValue: 'Study Area 2'},
    {value: 'studyArea3', viewValue: 'Study Area 3'}
  ];

  selectedCrop = "";
  cropTypes = [
    {value: 'cropType1', viewValue: 'Crop Type 1'},
    {value: 'cropType2', viewValue: 'Crop Type 2'},
    {value: 'cropType3', viewValue: 'Crop Type 3'}
  ];

  selectedStartYear = "";
  startYears = [
    {value: '2017', viewValue: '2017'},
    {value: '2016', viewValue: '2016'},
    {value: '2015', viewValue: '2015'},
    {value: '2014', viewValue: '2014'}
  ];

  selectedEndYear = "";
  endYears = [
    {value: '2017', viewValue: '2017'},
    {value: '2016', viewValue: '2016'},
    {value: '2015', viewValue: '2015'},
    {value: '2014', viewValue: '2014'}
  ];

  /**
   * Component Life-cycle Methods
   */
  constructor() { }

  ngOnInit() {

    this.initializeMap()
  }

  /**
   * For initializing the map
   */
  initializeMap() {

    // map center and zoom
    this.map = L.map('map').setView([AppConfiguration.mapCenterLng, AppConfiguration.mapCenterLat], 3);

    // define aerial
    let osmAttr = '&copy; <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a>';
    let tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + AppConfiguration.baseMapAccessToken, {
      id: 'mapbox.satellite',
      attribution: osmAttr
    });

    /*
    // define aerial
    let attribution = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    let mapLink = '<a target="_blank" href="http://www.esri.com/">Esri</a>';
    let tileLayer = L.tileLayer(
      'http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; ' + mapLink + ', ' + attribution,
        maxZoom: 18,
      });
    */

    // add layer
    tileLayer.addTo(this.map);
  }
}
