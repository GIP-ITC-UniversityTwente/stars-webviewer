import { Component, OnInit } from '@angular/core';
import { StarsAPIService } from '../services/stars-api.service';

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
  selectedStudyAreaId: number;

  // represents the start year options a user can choose
  selectedStartYear: number;
  startYears: number[] = [];

  // represents the end year options a user can choose
  selectedEndYear: number = null;
  endYears: number[] = [];

  // represents the crop options a user can choose
  selectedCrop: string;
  cropNames = [];

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

  ngOnInit() { }

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
   * Handles when a user selects a study area option
   */
  onStudyAreaChange() {

    // get selected study area name
    let targetStudyAreaName = this.selectedStudyAreaName;

    // get study area Id
    this.selectedStudyAreaId = this.fetchStudyAreaId(targetStudyAreaName);

    /*
    // get study area geoJSON
    let geoJSONObject = this.createStudyAreaGeoJSON(targetStudyAreaName);

    // add the study area as a map layer
    this.addStudyAreaMapLayer(geoJSONObject);
    */
  }

  /**
   * Utility for fetching the study area Id for the input study area name
   * @param targetStudyAreaName
   */
  fetchStudyAreaId(targetStudyAreaName: string) {
    let result: number = null;
    this.studyAreas.forEach(function(item){
      if(item.properties.name == targetStudyAreaName) {
        result = item.properties.id;
      }
    });
    return result;
  }



  /**
   * Handle when a user selects a start year option
   */
  onStartYearChange() {

    // user selections
    let studyAreaId = this.selectedStudyAreaId;
    let startYear = this.selectedStartYear;

    // fetch farm fields
    this.starsAPIService.fetchFarmFields(studyAreaId, startYear).then((response) => {
      return response;
    }).then((data) => {

      // add farm fields geojson to map
      if (data.results.length > 0) {
        let farmFieldsFeatureArray = data.results;
        /*
        let farmFieldGeoJSON = this.createFarmFieldsGeoJson(farmFieldsFeatureArray);
        this.addFarmFieldsMapLayer(farmFieldGeoJSON);
        */
      }
    }).catch((error) => {
      console.log(error);
    });

    // fetch crops
    let cropNames = this.cropNames;
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
    let studyAreaId = this.selectedStudyAreaId;
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
    let studyAreaId = this.selectedStudyAreaId;
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
