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
    if (this.chart1SelectedImageType === this.imageTypes[0]) {
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
    if (this.chart1SelectedImageType === this.imageTypes[0]) {

      // load spectral sensor drop down options
      this.chart1Sensors = TimeSeriesBuilderService.fetchSensorsForImageCharacteristic(this.chart1SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart1SelectedImageCharacteristicId  = TimeSeriesBuilderService.fetchImageCharacteristicId(this.chart1SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);
    } else {

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
    this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor).then((response) => {
      return response;
    }).then((data) => {
      this.renderImageCharacteristicTimeSeriesChart(data, this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName, 'chart1');
    });
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
      const results = data.results;
      this.renderFieldCharacteristicTimeSeriesChart(results, this.chart1SelectedCharacteristicType, this.chart1SelectedFieldCharacteristicName, 'chart1');
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
    this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart2SelectedImageCharacteristicId, this.selectedChart2Sensor).then((response) => {
      return response;
    }).then((data) => {
      this.renderImageCharacteristicTimeSeriesChart(data, this.chart2SelectedImageType, this.chart2SelectedImageCharacteristicName, 'chart2');
    });
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
      const results = data.results;
      this.renderFieldCharacteristicTimeSeriesChart(results, this.chart2SelectedCharacteristicType, this.chart2SelectedFieldCharacteristicName, 'chart2');
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
   * @param {any[]} apiResponse
   * @param {string} xAxisTitle
   * @param {string} yAxisTitle
   * @param {string} targetDivId
   */
  renderImageCharacteristicTimeSeriesChart(apiResponse: any[], xAxisTitle: string, yAxisTitle: string, targetDivId: string) {
    // get data object for chart
    const chartData = TimeSeriesBuilderService.createTimeSeriesDataObject(apiResponse);

    // layout for millet spectral test sample
    const layout = {
      title: xAxisTitle + ' Time Series',
      xaxis: {
        title: 'Time',
        showgrid: true,
        zeroline: true,
        ticks: 'outside',
        showticklabels: true
      },
      yaxis: {
        title: yAxisTitle,
        showline: false,
        ticks: 'outside',
        showticklabels: true
      },
      hovermode: 'closest'
    };

    Plotly.newPlot(targetDivId,
      chartData,
      layout,
      {
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines'],
        displaylogo: false
      });
  }

  /**
   * Utility for rendering the field characteristics chart for the time series response.
   * @param {any[]} results
   * @param {string} xAxisTitle
   * @param {string} yAxisTitle
   * @param {string} targetDivId
   */
  renderFieldCharacteristicTimeSeriesChart(results: any[], xAxisTitle: string, yAxisTitle: string, targetDivId: string) {
    const chartData = [];

    for (const item of results) {
      const cropName = item.crop;
      const dateCollection = [];
      const avgValueCollection = [];
      const maxValueCollection = [];
      const minValueCollection = [];

      for (const crop of item.cseries[0]) { // note variation - need to do [0]
        dateCollection.push(crop.acquisition_date);
        avgValueCollection.push(crop.avgvalue);
        if (crop.hasOwnProperty('maxvalue') && crop.hasOwnProperty('minvalue')) {
          if (crop.maxvalue != null) {
            maxValueCollection.push(crop.maxvalue); // note variation - does not always have max and min values - only avg
          }
          if (crop.minvalue != null) {
            minValueCollection.push(crop.minvalue);
          }
        }
      }

      //
      console.log('date collection: ' + dateCollection);
      console.log('avgvalue: ' + avgValueCollection);
      console.log('maxvalue: ' + maxValueCollection);
      console.log('minvalue: ' + minValueCollection);

      // draw line and envelope
      if (avgValueCollection.length === maxValueCollection.length) {

        // chart's line
        const lineColor = TimeSeriesBuilderService.fetchTimeSeriesLineColor();
        const lineDataObject = {
          x: dateCollection,
          y: avgValueCollection,
          mode: 'lines',
          name: cropName,
          line: {
            color: lineColor,
            width: 3
          },
          type: 'scatter'
        };

        // chart's envelope
        const envelopeY = minValueCollection;
        for (let i = maxValueCollection.length - 1; i >= 0; i--) {
          envelopeY.push(maxValueCollection[i]);
        }

        const envelopeX = dateCollection;
        for (let j = dateCollection.length - 1; j >= 0; j--) {
          envelopeX.push(dateCollection[j]);
        }

        const backgroundColor = TimeSeriesBuilderService.fetchTimeSeriesEnvelopeColor(lineColor);
        const envelopeDataObject = {
          x: envelopeX,
          y: envelopeY,
          fill: 'tozerox',
          fillcolor: backgroundColor,
          name: '',
          showlegend: false,
          type: 'scatter',
          line: {color: 'transparent'}
        };

        // add line & envelope to chart data
        chartData.push(envelopeDataObject);
        chartData.push(lineDataObject);
      } else {

        // only draw line ...

        // chart's line
        const lineColor = TimeSeriesBuilderService.fetchTimeSeriesLineColor();
        const lineDataObject = {
          x: dateCollection,
          y: avgValueCollection,
          mode: 'lines',
          name: cropName,
          line: {
            color: lineColor,
            width: 3
          },
          type: 'scatter'
        };

        // add line & envelope to chart data
        chartData.push(lineDataObject);
      }
    }

    // layout for millet spectral test sample
    const layout = {
      title: xAxisTitle + ' Time Series',
      xaxis: {
        title: 'Time',
        showgrid: true,
        zeroline: true,
        ticks: 'outside',
        showticklabels: true
      },
      yaxis: {
        title: yAxisTitle,
        showline: false,
        ticks: 'outside',
        showticklabels: true
      },
      hovermode: 'closest'
    };

    Plotly.newPlot(targetDivId,
      chartData,
      layout,
      {
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines'],
        displaylogo: false
      });
  }
}
