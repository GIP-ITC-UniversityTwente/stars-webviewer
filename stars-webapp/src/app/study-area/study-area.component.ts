import { Component, OnInit } from '@angular/core';
import { AppConfiguration } from '../app-configuration';
import { StarsAPIService } from '../services/stars-api.service';

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
  selectedStudyAreaName: string;
  selectedStudyAreaGeoJSON: any;
  selectedStudyAreaLayer: any;
  selectedFarmFieldsLayer: any;

  // represents the start year options a user can choose
  selectedStartYear: number;
  startYears: number[] = [];

  // represents the end year options a user can choose
  selectedEndYear: number = null;
  endYears: number[] = [];

  // represents the crop options a user can choose
  selectedCrop: string;
  cropNames = [];

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

      // use the study areas response as the data for the study area options and associated start/end year options
      let results = data.results;
      this.initializeStudyAreaOptions(results, this.studyAreas);
      this.initializeStartYearOptions(results, this.startYears);
      this.initializeEndYearOptions(results, this.endYears);

    }).catch((error) => {
      console.log(error);
    });
  }

  ngOnInit() {
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
   * @param results - the results from the async call to the API for study areas
   * @param startYears - the collection of all start years
   */
  initializeStartYearOptions(results: any, startYears: any) {
    results.forEach(function(item) {
      startYears.push(item.properties.year_start);
    })
  }

  /**
   * For initializing the end year options a user can choose from
   * @param results - the results from the async call to the API for study areas
   * @param endYears - the collection of all end years
   */
  initializeEndYearOptions(results: any, endYears: any) {
    results.forEach(function(item) {
      endYears.push(item.properties.year_end);
    })
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
    let attribution = 'i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    let mapLink = '<a target="_blank" href="http://www.esri.com/">Esri</a>';
    let tileLayer = L.tileLayer(
      'http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; ' + mapLink + ', ' + attribution,
        maxZoom: 18,
      });

    // add layer
    tileLayer.addTo(this.map);
  }

  /**
   * Handles when a user selects a study area option
   */
  onStudyAreaChange() {

    // for the selected study area name, get the associated geojson object
    let targetStudyAreaName = this.selectedStudyAreaName;
    this.selectedStudyAreaGeoJSON = this.findStudyAreaGeoJSON(targetStudyAreaName);

    // create a leaflet geojson layer and add to the map
    if (this.selectedStudyAreaLayer == null) {
      this.selectedStudyAreaLayer = L.geoJSON(this.selectedStudyAreaGeoJSON).addTo(this.map);
    }

    // zoom to the extent of the study area geojson
    this.map.fitBounds(this.selectedStudyAreaLayer.getBounds());
  }

  /**
   * Utility for fetching the study area GeoJSON object for a study area name
   * @param targetStudyAreaName - the name of the study area we want the associated geojson for
   * @returns {{}} - the geojson for the study area name
   */
  findStudyAreaGeoJSON(targetStudyAreaName: string) {
    let result = {};
    this.studyAreas.forEach(function(item){
      if(item.properties.name == targetStudyAreaName) {
        result = item;
      }
    });
    return result;
  }

  /**
   * Handle when a user selects a start year option
   */
  onStartYearChange() {

    // user selections
    let studyAreaId = this.selectedStudyAreaGeoJSON.properties.id;
    let startYear = this.selectedStartYear;
    let cropNames = this.cropNames;

    // fetch farm fields
    this.starsAPIService.fetchFarmFields(studyAreaId, startYear).then((response) => {
      return response;
    }).then((data) => {

      // add farm fields geojson to map
      if (data.results.length > 0) {
        let farmFieldsGeoJSONArray = data.results;
        if (this.selectedFarmFieldsLayer == null) {

          // the first time, create a Leaflet GeoJSON Layer
          this.selectedFarmFieldsLayer = L.geoJSON(farmFieldsGeoJSONArray);
        }
        else {

          // if the Leaflet GeoJSON Layer was previously instantiated, then update the GeoJSON with new features
          this.selectedFarmFieldsLayer.clearLayers();
          this.selectedFarmFieldsLayer.addData(farmFieldsGeoJSONArray);
        }

        // add the farm fields to the map
        this.selectedFarmFieldsLayer.addTo(this.map);

        // zoom the map into the extent of the farm fields geometry
        this.map.fitBounds(this.selectedFarmFieldsLayer.getBounds());
      }
    }).catch((error) => {
      console.log('There are no farmfields for study area id: ' + studyAreaId +  ' and start year: ' + startYear + ' error: ' + error);
    });

    // fetch crops
    this.starsAPIService.fetchCropTypes(studyAreaId, startYear, null).then((response) => {
      return response;
    }).then((data) => {
      let results = data.results;
      if (results.length > 0) {
        results.forEach(function(item){
          let cropName = item.name;
          cropNames.push(cropName);
        })
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  /**
   * Handles when a user selects an end year option
   */
  onEndYearChange() {

    // user selections
    let studyAreaId = this.selectedStudyAreaGeoJSON.properties.id;
    let startYear = this.selectedStartYear;
    let endYear = this.selectedEndYear;
    let cropNames = this.cropNames = [];

    this.starsAPIService.fetchCropTypes(studyAreaId, startYear, endYear).then((response) => {
      return response;
    }).then((data) => {
      let results = data.results;
      if (results.length > 0) {
        results.forEach(function(item){
          let cropName = item.name;
          cropNames.push(cropName);
        })
      }
    }).catch((error) => {
      console.log(error);
    })
  }

  /**
   * Handles when a user selects a crop type option
   */
  onCropTypeChange() {

    // user selections
    let studyAreaId = this.selectedStudyAreaGeoJSON.properties.id;
    let startYear = this.selectedStartYear;
    let endYear = this.selectedEndYear;
    let crop = this.selectedCrop;

    console.log('study area: ' + studyAreaId + ' startYear: ' + startYear + ' endYear: ' + endYear + ' crop: ' + crop);


    this.starsAPIService.fetchImageCharacteristics(studyAreaId, startYear, endYear).then((response) => {
      return response;
    }).then((data) => {
      console.log(data);
    }).catch((error) => {
      console.log(error);
    })
  }
}
