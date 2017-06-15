import { Component, OnInit } from '@angular/core';
import { AppConfiguration } from '../app-configuration';
import { StarsAPIService } from '../services/stars-api.service';
import { GeoJsonObject } from '@types/geojson';

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

  // represents the study area options a user can choose
  studyAreas: any[] = [];
  studyAreaMapLayer: any;
  selectedStudyArea: string;

  // represents the start year options a user can choose
  selectedStartYear: number;
  startYears: number[] = [];

  // represents the end year options a user can choose
  selectedEndYear: number;
  endYears: number[] = [];

  // represents the crop options a user can choose
  cropTypes = [
    {value: 'cropType1', viewValue: 'Crop Type 1'},
    {value: 'cropType2', viewValue: 'Crop Type 2'},
    {value: 'cropType3', viewValue: 'Crop Type 3'}
  ];
  selectedCrop: string = "";

  // the Leaflet map
  map: any;

  /**
   * Component Life-cycle Methods
   */

  constructor(private starsAPIService: StarsAPIService) {

    // fetch study areas from the API
    starsAPIService.fetchStudyAreas().then((response) => {
      return response;
    }).then((data) => {

      // use the study areas response as the data for the study area options
      let results = data["results"];
      this.initializeStudyAreaOptions(results, this.studyAreas);
    }).catch((error) => {
      console.log(error);
    });
  }

  ngOnInit() {
    this.initializeStartYearOptions();
    this.initializeEndYearOptions();
    this.initializeMap();
  }

  /**
   * For initializing the study area options
   * @param results - the results from the async call to the API for study areas
   * @param studyAreas - the instance property that represents a collection of study areas
   */
  initializeStudyAreaOptions(results: JSON[], studyAreas: JSON[]) {
    results.forEach(function(item) {
      studyAreas.push(item);
    })
  }

  /**
   * For initializing the start year options a user can choose from
   */
  initializeStartYearOptions() {

    this.startYears = this.fetchCollectionOfPreviousYears();
  }

  /**
   * For initializing the end year options a user can choose from
   */
  initializeEndYearOptions() {

    this.endYears = this.fetchCollectionOfPreviousYears();
  }

  /**
   * A utility that simply returns an array of previous years starting with the current year.
   */
  fetchCollectionOfPreviousYears(): number[] {

    let results: number[] = [];

    let currentYear = new Date().getFullYear();
    for(let i = 0; i < 14; i++) {
      results.push(currentYear);
      currentYear -= 1;
    }

    return results;
  }

  /**
   * For initializing the map
   */
  initializeMap() {

    // create map with options
    this.map = L.map('map', {
      scrollWheelZoom: false
    });

    // zoom to default extent
    this.map.setView([AppConfiguration.mapCenterLng, AppConfiguration.mapCenterLat], 3);

    // define aerial layer
    let osmAttr = '&copy; <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a>';
    let tileLayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + AppConfiguration.baseMapAccessToken, {
      id: 'mapbox.satellite',
      attribution: osmAttr
    });

    /*
    // define aerial layer (a second option)
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

  /**
   * Handles when a user selects a study area option
   */
  onStudyAreaChange() {

    // for the selected study area, get the associated geojson object
    let targetStudyAreaName = this.selectedStudyArea;
    let targetStudyAreaGeoJSON = {};
    this.studyAreas.forEach(function(item){
      if(item.properties.name == targetStudyAreaName) {
        targetStudyAreaGeoJSON = item;
      }
    });

    // create a leaflet geojson layer and add to the map
    if (this.studyAreaMapLayer == null) {
      this.studyAreaMapLayer = L.geoJSON(targetStudyAreaGeoJSON).addTo(this.map);
    }

    // zoom to the extent of the study area geojson
    this.map.fitBounds(this.studyAreaMapLayer.getBounds());
  }

  /**
   * Handle when a user selects a start year option
   */
  onStartYearChange() {
    console.log(this.selectedStartYear);
  }

  /**
   * Handles when a user selects an end year option
   */
  onEndYearChange() {
    console.log(this.selectedEndYear);
  }

  /**
   * Handles when a user selects a crop type option
   */
  onCropTypeChange() {
    console.log(this.selectedCrop);
  }
}
