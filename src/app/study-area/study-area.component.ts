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
  startYear: number;
  startYears: number[] = []; // will include start years and end years

  // represents the end year options a user can choose
  selectedEndYear: number = null;
  endYear: number;
  endYears: number[] = []; // will include start years and end years

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

    //
    console.log('study areas constructor', new Date().toLocaleString());

    // fetch study areas from the API
    starsAPIService.fetchStudyAreas().then((response) => {
      return response;
    }).then((data) => {

      // use the study areas response as the data for the study area options and associated start/end year options
      const results = data.results;
      this.initializeStudyAreaOptions(results, this.studyAreas);
      this.initializeStartAndEndYearOptions(results);

      // set the default values for application load
      this.initializeDefaultValues();

    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Life-cycle hook after component is created.
   */
  ngOnInit() {

    //
    console.log('study areas ngOnInit', new Date().toLocaleString());
  }

  /**
   * For loading the app with some default parameters for selected study area, start year, end year, and crop type
   */
  initializeDefaultValues() {

    // set default study area
    this.selectedStudyAreaName = 'Mali, Sikasso, around Sougoumba';
    this.selectedStudyAreaId = this.fetchStudyAreaId(this.selectedStudyAreaName);
    let studyAreaString = {"type":"Feature","properties":{"id":1000,"name":"Mali, Sikasso, around Sougoumba","year_start":2014,"year_end":2015},"geometry":{"type":"Polygon","coordinates":[[[-5.143373,12.13132],[-5.235212,12.130594],[-5.235968,12.220957],[-5.144098,12.221689],[-5.143373,12.13132]]]}};
    this.userSelectionService.updateStudyArea(studyAreaString);

    /*
    // set default start year
    this.selectedStartYear = 2014;
    this.userSelectionService.updateStartYear(this.selectedStartYear);

    // set default end year
    this.selectedEndYear = 2014;
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
    */
  }

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
   * For initializing the start and end year options a user can choose from.
   * @param results
   */
  initializeStartAndEndYearOptions(results: any) {

    let responseStartYear: number;
    let responseEndYear: number;
    results.forEach(function(item) {
      // the start year and end year returned from the API
      responseStartYear = item.properties.year_start;
      responseEndYear = item.properties.year_end;
    });

    // hold on to start and end year from API
    this.startYear = responseStartYear;
    this.endYear = responseEndYear;

    // start years drop down will provide both start year and end year
    this.startYears.push(this.startYear);
    this.startYears.push(this.endYear);

    // end years drop down will provide both start year and end year
    this.endYears.push(this.startYear);
    this.endYears.push(this.endYear);
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

    // clear downstream
    this.selectedEndYear = undefined;
    this.selectedCrops = [];
    this.crops = [];

    const startYear = this.selectedStartYear;

    // inform other components that the start year has been declared
    this.userSelectionService.updateStartYear(startYear);

    // after choosing start year, reset options and ensure that end year options that are less than the start year must be removed
    this.startYears = [];
    this.endYears = [];
    if (this.selectedStartYear >= this.endYear) {
      this.startYears.push(this.startYear);
      this.startYears.push(this.endYear);
      this.endYears.push(this.endYear);
    } else {
      this.startYears.push(this.startYear);
      this.startYears.push(this.endYear);
      this.endYears.push(this.startYear);
      this.endYears.push(this.endYear);
    }
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

    // get crop types now that we have start year and end year
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
