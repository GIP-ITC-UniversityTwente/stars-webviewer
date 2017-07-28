import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AppConfiguration } from '../app-configuration';
import { StarsAPIService } from '../services/stars-api.service';
import { UserSelectionService } from '../services/user-selection.service';
import { TimeSeriesBuilderService } from '../services/time-series-builder.service';

declare const Plotly: any;

@Component({
  selector: 'app-time-series',
  templateUrl: './time-series.component.html',
  styleUrls: ['./time-series.component.css']
})
export class TimeSeriesComponent implements OnInit, OnDestroy {

  /**
   * Properties
   */
  chart2IsShowing = false;

  subscriptionToSelectedStudyArea: Subscription;
  studyArea: JSON;
  studyAreaId: number;
  subscriptionToSelectedStartYear: Subscription;
  startYear: number;
  subscriptionToSelectedEndYear: Subscription;
  endYear: number;
  subscriptionToSelectedCropTypes: Subscription;
  cropList: string;

  characteristicTypes: string[] = [];
  imageTypes: string[] = [];
  fieldTypes: any[] = [];
  allSpectralCharacteristicObjects: any[] = [];
  allTexturalCharacteristicObjects: any[] = [];

  chart1ImageOptionsAreVisible = false;
  chart1FieldOptionsAreVisible = false;
  chart1SelectedCharacteristicType: string;
  chart1SelectedImageType: string;
  chart1ImageCharacteristics: any[] = [];
  chart1SelectedImageCharacteristicName: string;
  chart1SelectedImageCharacteristicId: number;
  chart1Sensors: any[] = [];
  selectedChart1Sensor: string;

  chart1Parameter1IsVisible = false;
  chart1Parameter1Name: string;
  chart1Parameter1Range: number[];
  chart1SelectedParameter1Option: number;
  chart1Parameter2IsVisible = false;
  chart1Parameter2Name: string;
  chart1Parameter2Range: number[];
  chart1SelectedParameter2Option: number;

  chart2Parameter1IsVisible = false;
  chart2Parameter1Name: string;
  chart2Parameter1Range: number[];
  chart2SelectedParameter1Option: number;
  chart2Parameter2IsVisible = false;
  chart2Parameter2Name: string;
  chart2Parameter2Range: number[];
  chart2SelectedParameter2Option: number;

  chart1SelectedFieldCharacteristicName: string;
  chart1SelectedFieldCharacteristicId: number;

  chart2ImageOptionsAreVisible = false;
  chart2FieldOptionsAreVisible = false;
  chart2SelectedCharacteristicType: string;
  chart2SelectedImageType: string;
  chart2ImageCharacteristics: any[] = [];
  chart2SelectedImageCharacteristicName: string;
  chart2SelectedImageCharacteristicId: number;
  chart2Sensors: any[] = [];
  selectedChart2Sensor: string;
  chart2SelectedFieldCharacteristicName: string;
  chart2SelectedFieldCharacteristicId: number;

  // tooltip
  toolTipPosition = 'right';
  timeSeriesTooltip = AppConfiguration.timeSeriesTooltip;

  /**
   * For dependency injecting needed services.
   */
  constructor(private userSelectionService: UserSelectionService, private starsAPIService: StarsAPIService) {

    // subscribe to the study area selection by the user
    this.subscriptionToSelectedStudyArea = this.userSelectionService.studyArea$.subscribe(
      studyArea => {
        this.studyArea = studyArea;
        this.studyAreaId = studyArea['properties']['id'];
      }
    );

    // subscribe to the start year selection by the user
    this.subscriptionToSelectedStartYear = this.userSelectionService.startYear$.subscribe(
      startYear => {
        this.startYear = startYear;

        // initialize characteristic types
        this.characteristicTypes = TimeSeriesBuilderService.fetchCharacteristicTypes();

        // initialize image types
        this.imageTypes = TimeSeriesBuilderService.fetchImageTypes();

        // initialize the image characteristic options
        this.initializeImageCharacteristicsOptions(this.studyAreaId, this.startYear, this.endYear);

        // initializes the field characteristic options
        this.initializeFieldCharacteristicOptions(this.studyAreaId, this.startYear, this.endYear);
      }
    );

    // subscribe to the end year selection by the user
    this.subscriptionToSelectedEndYear = this.userSelectionService.endYear$.subscribe(
      endYear => {
        this.endYear = endYear;

        // initialize characteristic types
        this.characteristicTypes = TimeSeriesBuilderService.fetchCharacteristicTypes();

        // initialize image types
        this.imageTypes = TimeSeriesBuilderService.fetchImageTypes();

        // initialize the image characteristic options
        this.initializeImageCharacteristicsOptions(this.studyAreaId, this.startYear, this.endYear);

        // initializes the field characteristic options
        this.initializeFieldCharacteristicOptions(this.studyAreaId, this.startYear, this.endYear);
      }
    );

    // subscribe to crop types selections by the user
    this.subscriptionToSelectedCropTypes = this.userSelectionService.cropTypes$.subscribe(
      cropTypes => {
        this.cropList = TimeSeriesBuilderService.createCropList(cropTypes);
      }
    );
  }

  /**
   * Life-cycle hook after component is created.
   */
  ngOnInit() {

    // fill out charts with test data
    TimeSeriesBuilderService.createTestCharts(Plotly);
  }

  /**
   * Lifecycle hook that is called when destroyed.
   */
  ngOnDestroy() {
    this.subscriptionToSelectedStudyArea.unsubscribe();
    this.subscriptionToSelectedStartYear.unsubscribe();
    this.subscriptionToSelectedEndYear.unsubscribe();
    this.subscriptionToSelectedCropTypes.unsubscribe();
  }

  /**
   * Handles when user choose a characteristic type for Chart 1.
   */
  onChart1CharacteristicTypeChange() {

    if (this.chart1SelectedCharacteristicType === this.characteristicTypes[0]) {

      // show image characteristic drop down options
      this.chart1ImageOptionsAreVisible = true;

      // hide field characteristic drop down options
      this.chart1FieldOptionsAreVisible = false;
    } else {

      // hide image characteristic drop down options
      this.chart1ImageOptionsAreVisible = false;

      // show field characteristic drop down options
      this.chart1FieldOptionsAreVisible = true;
    }
  }

  /**
   * Handles when user chooses an image type for Chart 1.
   */
  onChart1ImageTypeChange() {

    // clear previous dependent selections for image characteristic and sensor
    this.chart1SelectedImageCharacteristicName = undefined;
    this.selectedChart1Sensor = undefined;

    // add image characteristic drop down items
    if (this.chart1SelectedImageType === 'Spectral') {
      this.chart1ImageCharacteristics = TimeSeriesBuilderService.createUniqueCharacteristicNames(this.allSpectralCharacteristicObjects);
    } else {
      this.chart1ImageCharacteristics = TimeSeriesBuilderService.createUniqueCharacteristicNames(this.allTexturalCharacteristicObjects);
    }
  }

  /**
   * Handles when user chooses an image characteristic for Chart 1.
   */
  onChart1ImageCharacteristicChange() {

    // clear previous dependent selection for sensor
    this.selectedChart1Sensor = undefined;

    // add sensor drop down items
    if (this.chart1SelectedImageType === 'Spectral') {

      // load spectral sensor drop down options
      this.chart1Sensors = TimeSeriesBuilderService.fetchSensorsForImageCharacteristic(this.chart1SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart1SelectedImageCharacteristicId  = TimeSeriesBuilderService.fetchImageCharacteristicId(this.chart1SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);
    } else {

      //
      console.log(this.allTexturalCharacteristicObjects);

      // load textural sensor drop down options
      this.chart1Sensors = TimeSeriesBuilderService.fetchSensorsForImageCharacteristic(this.chart1SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart1SelectedImageCharacteristicId  = TimeSeriesBuilderService.fetchImageCharacteristicId(this.chart1SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);
    }
  }

  /**
   * Handles when a user chooses a sensor for Chart 1.
   */
  onChart1SensorChange() {

    // check if chosen sensor will require additional parameters
    const parameters = TimeSeriesBuilderService.fetchParametersForImageCharacteristic(this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName, this.selectedChart1Sensor, this.allSpectralCharacteristicObjects, this.allTexturalCharacteristicObjects);
    if (parameters.length === 0) {

      // render the time series
      this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor).then((response) => {
        return response;
      }).then((data) => {
        const chartData = TimeSeriesBuilderService.createImageCharacteristicTimeSeriesData(data);
        const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName);
        this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'chart1');
      });
    } else if (parameters.length > 0) {

      // present parameters - we cannot yet render the time series
      if (parameters.length === 1) {

        //
        console.log('here for 1');

        // handle selection visibility
        this.chart1Parameter1IsVisible = true;
        this.chart1Parameter2IsVisible = false;

        // present parameter 1 to user
        const parameter1 = parameters[0];
        this.chart1Parameter1Name = TimeSeriesBuilderService.fetchParameterName(parameter1);
        this.chart1Parameter1Range = TimeSeriesBuilderService.fetchParameterRange(parameter1);
      } else {

        //
        console.log('here for 2');

        // handle selection visibility
        this.chart1Parameter1IsVisible = true;
        this.chart1Parameter2IsVisible = true;

        // present parameter 1 to user
        const parameter1 = parameters[0];
        this.chart1Parameter1Name = TimeSeriesBuilderService.fetchParameterName(parameter1);
        this.chart1Parameter1Range = TimeSeriesBuilderService.fetchParameterRange(parameter1);

        // present parameter 2 to user
        const parameter2 = parameters[1];
        this.chart1Parameter2Name = TimeSeriesBuilderService.fetchParameterName(parameter2);
        this.chart1Parameter2Range = TimeSeriesBuilderService.fetchParameterRange(parameter2);
      }
    }
  }

  /**
   * Handles when a user chooses a parameter 1 option for Chart 1.
   */
  onChart1Parameter1Change() {
    //
    console.log('param1 name: ', this.chart1Parameter1Name, ' range: ', this.chart1Parameter1Range, ' selected: ', this.chart1SelectedParameter1Option);

    const parameters = TimeSeriesBuilderService.fetchParametersForImageCharacteristic(this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName, this.selectedChart1Sensor, this.allSpectralCharacteristicObjects, this.allTexturalCharacteristicObjects);
    if (parameters.length === 1) {

      // render the time series
      this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor, this.chart1SelectedParameter1Option).then((response) => {
        return response;
      }).then((data) => {
        const chartData = TimeSeriesBuilderService.createImageCharacteristicTimeSeriesData(data);
        const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName);
        this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'chart1');
      });
    }
  }

  /**
   * Handles when a user chooses a parameter 2 option for Chart 1
   */
  onChart1Parameter2Change() {
    //
    console.log('param1 name: ', this.chart1Parameter1Name, ' range: ', this.chart1Parameter1Range, ' selected: ',   this.chart1SelectedParameter1Option);
    console.log('param2 name: ', this.chart1Parameter2Name, '  range: ', this.chart1Parameter2Range, ' selected: ',  this.chart1SelectedParameter2Option);

    const parameters = TimeSeriesBuilderService.fetchParametersForImageCharacteristic(this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName, this.selectedChart1Sensor, this.allSpectralCharacteristicObjects, this.allTexturalCharacteristicObjects);
    if (parameters.length === 2) {

      // render the time series
      this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor, this.chart1SelectedParameter1Option, this.chart1SelectedParameter2Option).then((response) => {
        return response;
      }).then((data) => {
        const chartData = TimeSeriesBuilderService.createImageCharacteristicTimeSeriesData(data);
        const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName);
        this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'chart1');
      });
    }
  }

  /**
   * Handles when a user chooses a field characteristic for Chart 1.
   */
  onChart1FieldCharacteristicChange() {

    // fetch the field characteristic id
    const targetFieldCharName = this.chart1SelectedFieldCharacteristicName;
    let fieldCharId: number = undefined;
    this.fieldTypes.forEach(function(item){
      if (item.alias === targetFieldCharName) {
        fieldCharId = item.oid;
      }
    });
    this.chart1SelectedFieldCharacteristicId = fieldCharId;

    // fetch the time series for the selected field characteristic
    this.starsAPIService.fetchFieldCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedFieldCharacteristicId).then((response) => {
      return response;
    }).then((data) => {

      //
      console.log(data);

      const chartData = TimeSeriesBuilderService.createFieldCharacteristicTimeSeriesData(data);
      const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout('Field Characteristic', this.chart1SelectedFieldCharacteristicName);
      this.renderFieldCharacteristicTimeSeriesChart(chartData, chartLayout, 'chart1');
    });
  }

  /**
   * Handles when user choose a characteristic type for Chart 2.
   */
  onChart2CharacteristicTypeChange() {
    if (this.chart2SelectedCharacteristicType === this.characteristicTypes[0]) {

      // show image characteristic drop down options
      this.chart2ImageOptionsAreVisible = true;

      // hide field characteristic drop down options
      this.chart2FieldOptionsAreVisible = false;
    } else {

      // hide image characteristic drop down options
      this.chart2ImageOptionsAreVisible = false;

      // show field characteristic drop down options
      this.chart2FieldOptionsAreVisible = true;
    }
  }

  /**
   * Handles when user chooses an image type for Chart 2.
   */
  onChart2ImageTypeChange() {

    // clear previous dependent selections for image characteristic and sensor
    if (this.chart2SelectedImageCharacteristicName !== undefined) {
      this.chart2SelectedImageCharacteristicName = undefined;
    }

    if (this.selectedChart2Sensor !== undefined) {
      this.selectedChart2Sensor = undefined;
    }

    // add image characteristic drop down items
    if (this.chart2SelectedImageType === 'Spectral') {
      this.chart2ImageCharacteristics = TimeSeriesBuilderService.createUniqueCharacteristicNames(this.allSpectralCharacteristicObjects);
    } else {
      this.chart2ImageCharacteristics = TimeSeriesBuilderService.createUniqueCharacteristicNames(this.allTexturalCharacteristicObjects);
    }
  }

  /**
   * Handles when user chooses an image characteristic for Chart 2.
   */
  onChart2ImageCharacteristicChange() {

    // clear previous dependent selection for sensor
    if (this.selectedChart2Sensor !== undefined) {
      this.selectedChart2Sensor = undefined;
    }

    // add sensor drop down items
    if (this.chart2SelectedImageType === 'Spectral') {

      // load sensor drop down options
      this.chart2Sensors = TimeSeriesBuilderService.fetchSensorsForImageCharacteristic(this.chart2SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart2SelectedImageCharacteristicId  = TimeSeriesBuilderService.fetchImageCharacteristicId(this.chart2SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);
    } else {

      // load sensor drop down options
      this.chart2Sensors = TimeSeriesBuilderService.fetchSensorsForImageCharacteristic(this.chart2SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart2SelectedImageCharacteristicId  = TimeSeriesBuilderService.fetchImageCharacteristicId(this.chart2SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);
    }
  }

  /**
   * Handles when a user chooses a sensor for Chart 2.
   */
  onChart2SensorChange() {

    // check if chosen sensor will require additional parameters
    const parameters = TimeSeriesBuilderService.fetchParametersForImageCharacteristic(this.chart2SelectedImageType, this.chart2SelectedImageCharacteristicName, this.selectedChart2Sensor, this.allSpectralCharacteristicObjects, this.allTexturalCharacteristicObjects);
    if (parameters.length === 0) {

      // render the time series
      this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart2SelectedImageCharacteristicId, this.selectedChart2Sensor).then((response) => {
        return response;
      }).then((data) => {
        const chartData = TimeSeriesBuilderService.createImageCharacteristicTimeSeriesData(data);
        const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart2SelectedImageType, this.chart2SelectedImageCharacteristicName);
        this.renderImageCharacteristicTimeSeriesChart(chartData,  chartLayout, 'chart2');
      });
    } else {

      // present parameters - we cannot yet render the time series
      if (parameters.length === 1) {

        // handle selection visibility
        this.chart2Parameter1IsVisible = true;
        this.chart2Parameter2IsVisible = false;

        // present parameter 1 to user
        const parameter1 = parameters[0];
        this.chart2Parameter1Name = TimeSeriesBuilderService.fetchParameterName(parameter1);
        this.chart2Parameter1Range = TimeSeriesBuilderService.fetchParameterRange(parameter1);
      } else {

        // handle selection visibility
        this.chart2Parameter1IsVisible = true;
        this.chart2Parameter2IsVisible = true;

        // present parameter 1 to user
        const parameter1 = parameters[0];
        this.chart2Parameter1Name = TimeSeriesBuilderService.fetchParameterName(parameter1);
        this.chart2Parameter1Range = TimeSeriesBuilderService.fetchParameterRange(parameter1);

        // present parameter 2 to user
        const parameter2 = parameters[1];
        this.chart2Parameter2Name = TimeSeriesBuilderService.fetchParameterName(parameter2);
        this.chart2Parameter2Range = TimeSeriesBuilderService.fetchParameterRange(parameter2);
      }
    }
  }

  /**
   * Handles when a user chooses a parameter 1 option for Chart 2.
   */
  onChart2Parameter1Change() {
    //
    console.log('param1 name: ', this.chart2Parameter1Name, ' range: ', this.chart2Parameter1Range, ' selected: ', this.chart2SelectedParameter1Option);

    const parameters = TimeSeriesBuilderService.fetchParametersForImageCharacteristic(this.chart2SelectedImageType, this.chart2SelectedImageCharacteristicName, this.selectedChart2Sensor, this.allSpectralCharacteristicObjects, this.allTexturalCharacteristicObjects);
    if (parameters.length === 1) {

      // render the time series
      this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart2SelectedImageCharacteristicId, this.selectedChart2Sensor, this.chart2SelectedParameter1Option).then((response) => {
        return response;
      }).then((data) => {
        const chartData = TimeSeriesBuilderService.createImageCharacteristicTimeSeriesData(data);
        const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart2SelectedImageType, this.chart2SelectedImageCharacteristicName);
        this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'chart1');
      });
    }
  }

  /**
   * Handles when a user chooses a parameter 2 option for Chart 2.
   */
  onChart2Parameter2Change() {
    //
    console.log('param1 name: ', this.chart2Parameter1Name, ' range: ', this.chart2Parameter1Range, ' selected: ',   this.chart2SelectedParameter1Option);
    console.log('param2 name: ', this.chart2Parameter2Name, '  range: ', this.chart2Parameter2Range, ' selected: ',  this.chart2SelectedParameter2Option);

    const parameters = TimeSeriesBuilderService.fetchParametersForImageCharacteristic(this.chart2SelectedImageType, this.chart2SelectedImageCharacteristicName, this.selectedChart2Sensor, this.allSpectralCharacteristicObjects, this.allTexturalCharacteristicObjects);
    if (parameters.length === 2) {

      // render the time series
      this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart2SelectedImageCharacteristicId, this.selectedChart2Sensor, this.chart2SelectedParameter1Option, this.chart2SelectedParameter2Option).then((response) => {
        return response;
      }).then((data) => {
        const chartData = TimeSeriesBuilderService.createImageCharacteristicTimeSeriesData(data);
        const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart2SelectedImageType, this.chart2SelectedImageCharacteristicName);
        this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'chart1');
      });
    }
  }

  /**
   * Handles when a user chooses a field characteristic for Chart 2.
   */
  onChart2FieldCharacteristicChange() {

    // fetch the field characteristic id
    const targetFieldCharName = this.chart2SelectedFieldCharacteristicName;
    let fieldCharId: number = undefined;
    this.fieldTypes.forEach(function(item){
      if (item.alias === targetFieldCharName) {
        fieldCharId = item.oid;
      }
    });
    this.chart2SelectedFieldCharacteristicId = fieldCharId;

    // fetch the time series for the selected field characteristic
    this.starsAPIService.fetchFieldCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart2SelectedFieldCharacteristicId).then((response) => {
      return response;
    }).then((data) => {
      //
      console.log(JSON.stringify(data));

      const chartData = TimeSeriesBuilderService.createFieldCharacteristicTimeSeriesData(data);
      const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout('Field Characteristic', this.chart2SelectedFieldCharacteristicName);
      this.renderFieldCharacteristicTimeSeriesChart(chartData, chartLayout, 'chart2');
    });
  }

  /**
   * Handles when user taps on info icon for Image Characteristics.
   */
  handleInfoButtonTap() {
    console.log('show info for image characteristics...');
  }

  /**
   * Handles when user taps on the 'add a chart' button.
   */
  handleAddChartButtonTap() {
    if (this.chart2IsShowing) {
      this.chart2IsShowing = false;
    } else {
      this.chart2IsShowing = true;
    }
  }

  /**
   * Utility for initializing the image characteristic options
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   */
  initializeImageCharacteristicsOptions(studyAreaId: number, startYear: number, endYear: number = undefined) {
    this.starsAPIService.fetchImageCharacteristics(studyAreaId, startYear, endYear).then((response) => {
      return response;
    }).then((data) => {
      this.allSpectralCharacteristicObjects = data.results.spectralCharacteristics;
      this.allTexturalCharacteristicObjects = data.results.texturalCharacteristics;
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Utility for initializing the field characteristic options
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   */
  initializeFieldCharacteristicOptions(studyAreaId: number, startYear: number, endYear: number = undefined) {

    this.starsAPIService.fetchFieldCharacteristics(studyAreaId, startYear, endYear).then((response) => {
      return response;
    }).then((data) => {
      this.fieldTypes = data.results.fieldCharacteristics;
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Utility for rendering the image characteristics chart for the time series response.
   * @param {any} chartData
   * @param {any} chartLayout
   * @param {string} targetDivId
   */
  renderImageCharacteristicTimeSeriesChart(chartData: any, chartLayout: any, targetDivId: string) {
    Plotly.newPlot(targetDivId,
      chartData,
      chartLayout,
      {
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines'],
        displaylogo: false
      });
  }

  /**
   * Utility for rendering the field characteristics chart for the time series response.
   * @param {any[]} chartData
   * @param {string} chartLayout
   * @param {string} targetDivId
   */
  renderFieldCharacteristicTimeSeriesChart(chartData: any, chartLayout: any, targetDivId: string) {
    Plotly.newPlot(targetDivId,
      chartData,
      chartLayout,
      {
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines'],
        displaylogo: false
      });
  }
}
