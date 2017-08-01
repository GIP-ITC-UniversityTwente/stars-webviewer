import { Component, OnInit } from '@angular/core';

import { AppConfiguration } from '../app-configuration';
import { StarsAPIService } from '../services/stars-api.service';
import { UserSelectionService } from '../services/user-selection.service';

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
  selectedCrops: string[] = [];
  crops: any[] = [];

  // tooltips
  toolTipPosition = 'right';
  studyAreaToolTip = AppConfiguration.studyAreaToolTip;
  cropTypeToolTip = AppConfiguration.cropTypeToolTip;

  /**
   * For dependency injecting needed services.
   */
  constructor(private starsAPIService: StarsAPIService, private userSelectionService: UserSelectionService) {

    // fetch study areas from the API
    starsAPIService.fetchStudyAreas().then((response) => {
      return response;
    }).then((data) => {

      // use the study areas response as the data for the study area options and associated start/end year options
      const results = data.results;
      this.initializeStudyAreaOptions(results, this.studyAreas);
      this.initializeStartYearOptions(results, this.startYears);
      this.initializeEndYearOptions(results, this.endYears);

      // set the default values for application load
      this.initializeDefaultValues();

    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Life-cycle hook after component is created.
   */
  ngOnInit() { }

  /**
   * For initializing the study area options.
   * @param results - the results from the async call to the API for study areas
   * @param studyAreas - the instance property that represents a collection of study areas
   */
  initializeStudyAreaOptions(results: JSON[], studyAreas: JSON[]) {
    results.forEach(function(item) {
      studyAreas.push(item);
    });
  }

  /**
   * For initializing the start year options a user can choose from.
   * @param results - the results from the async call to the API for study areas
   * @param startYears - the collection of all start years
   */
  initializeStartYearOptions(results: any, startYears: any) {
    results.forEach(function(item) {
      startYears.push(item.properties.year_start);
    });
  }

  /**
   * For initializing the end year options a user can choose from.
   * @param results - the results from the async call to the API for study areas
   * @param endYears - the collection of all end years
   */
  initializeEndYearOptions(results: any, endYears: any) {
    results.forEach(function(item) {
      endYears.push(item.properties.year_end);
    });
  }

  /**
   * For loading the app with some default parameters
   */
  initializeDefaultValues() {

    // set default study area
    this.selectedStudyAreaName = 'Mali, Sikasso, around Sougoumba';
    this.selectedStudyAreaId = this.fetchStudyAreaId(this.selectedStudyAreaName);
    let studyAreaString = {"type":"Feature","properties":{"id":1000,"name":"Mali, Sikasso, around Sougoumba","year_start":2014,"year_end":2015},"geometry":{"type":"Polygon","coordinates":[[[-5.143373,12.13132],[-5.235212,12.130594],[-5.235968,12.220957],[-5.144098,12.221689],[-5.143373,12.13132]]]}};
    this.userSelectionService.updateStudyArea(studyAreaString);

    // set default start year
    this.selectedStartYear = 2014;
    this.userSelectionService.updateStartYear(this.selectedStartYear);

    // set default end year
    this.selectedEndYear = 2015;
    this.userSelectionService.updateEndYear(this.selectedEndYear);

    // set default crop type
    let defaultCropName = 'Groundnut';
    const crops = this.crops;
    this.starsAPIService.fetchCropTypes(this.selectedStudyAreaId, this.selectedStartYear, this.selectedEndYear).then((response) => {
      return response;
    }).then((data) => {
      const results = data.results;
      if (results.length > 0) {
        results.forEach(function(item){
          if (item['name'] != null) {
            if (item['name'] === defaultCropName) {
              item['isChecked'] = true;
              crops.push(item);
            } else {
              item['isChecked'] = false;
              crops.push(item);
            }
          }
        });
      }
    }).catch((error) => {
      console.log(error);
    });
    this.selectedCrops = [defaultCropName];
    this.userSelectionService.updateCropTypes(this.selectedCrops);
  }

  /**
   * Handles when a user selects a study area option.
   */
  onStudyAreaChange() {

    // get the study area id for a follow up call when needing to fetch crop types
    this.selectedStudyAreaId = this.fetchStudyAreaId(this.selectedStudyAreaName);

    // get selected study area name
    const targetStudyAreaName = this.selectedStudyAreaName;
    for (const studyArea of this.studyAreas) {
      if (studyArea.properties.name === targetStudyAreaName) {
        this.userSelectionService.updateStudyArea(studyArea);
      }
    }
  }

  /**
   * Utility for fetching the study area Id for the input study area name.
   * @param targetStudyAreaName
   */
  fetchStudyAreaId(targetStudyAreaName: string) {
    let result: number = null;
    this.studyAreas.forEach(function(item){
      if (item.properties.name === targetStudyAreaName) {
        result = item.properties.id;
      }
    });
    return result;
  }

  /**
   * Handle when a user selects a start year option.
   */
  onStartYearChange() {

    // user selections
    const studyAreaId = this.selectedStudyAreaId;
    const startYear = this.selectedStartYear;
    const crops = this.crops;

    // inform other components that the start year has been declared
    this.userSelectionService.updateStartYear(startYear);

    // fetch crops
    this.starsAPIService.fetchCropTypes(studyAreaId, startYear).then((response) => {
      return response;
    }).then((data) => {
      const results = data.results;
      if (results.length > 0) {
        results.forEach(function(item){
          if (item['name'] != null) {
            item['isChecked'] = false;
            crops.push(item);
          }
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Handles when a user selects an end year option.
   */
  onEndYearChange() {

    // clear any previous
    this.crops = [];

    // user selections
    const studyAreaId = this.selectedStudyAreaId;
    const startYear = this.selectedStartYear;
    const endYear = this.selectedEndYear;
    const crops = this.crops;

    // inform other components that the end year has been declared
    this.userSelectionService.updateEndYear(endYear);

    // get crop types
    this.starsAPIService.fetchCropTypes(studyAreaId, startYear, endYear).then((response) => {
      return response;
    }).then((data) => {
      const results = data.results;
      if (results.length > 0) {
        results.forEach(function(item){
          if (item['name'] != null) {
            item['isChecked'] = false;
            crops.push(item);
          }
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Handles when a user selects a crop type option.
   */
  onCropTypeChange() {

    // clear previous
    this.selectedCrops = [];

    // get the crops that are checked
    for (const crop of this.crops) {
      if (crop['isChecked'] === true) {
        this.selectedCrops.push(crop['name']);
      }
    }

    // inform other components that the crop types are declared
    this.userSelectionService.updateCropTypes(this.selectedCrops);
  }

  /**
   * Handles when a user taps on the study area info.
   */
  handleInfoTapForStudyArea() {
    console.log('show study area info');
  }

  /**
   * Handles when a user taps on the crop type.
   */
  handleInfoTapForCropType() {
    console.log('show crop type info');
    console.log('show crop type info');
  }
}
