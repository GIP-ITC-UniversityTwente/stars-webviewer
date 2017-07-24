import { Component, OnInit, OnDestroy } from '@angular/core';
import { StarsAPIService } from '../services/stars-api.service';
import { Subscription } from 'rxjs/Subscription';
import { UserSelectionService } from '../services/user-selection.service';
import { AppConfiguration } from '../app-configuration';

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
  subscriptionToSelectedStartYear: Subscription;
  startYear: number;
  subscriptionToSelectedEndYear: Subscription;
  endYear: number;
  subscriptionToSelectedCropTypes: Subscription;
  cropTypes: string;

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
   * Component Life-cycle methods
   */
  constructor(private userSelectionService: UserSelectionService, private starsAPIService: StarsAPIService) {

    // subscribe to the study area selection by the user
    this.subscriptionToSelectedStudyArea = this.userSelectionService.studyArea$.subscribe(
      studyArea => {
        this.studyArea = studyArea;
      }
    );

    // subscribe to the start year selection by the user
    this.subscriptionToSelectedStartYear = this.userSelectionService.startYear$.subscribe(
      startYear => {

        this.startYear = startYear;

        // initialize the image characteristic options (and other options)
        starsAPIService.fetchImageCharacteristics(this.studyArea['properties']['id'], this.startYear).then((response) => {
          return response;
        }).then((data) => {

          this.allSpectralCharacteristicObjects = data.results.spectralCharacteristics;
          this.allTexturalCharacteristicObjects = data.results.texturalCharacteristics;
          this.characteristicTypes = ['Image Characteristic', 'Field Characteristic'];
          this.imageTypes = ['Spectral', 'Textural'];

        }).catch((error) => {
          console.log(error);
        });

        // initialize field characteristic options
        this.starsAPIService.fetchFieldCharacteristics(this.studyArea['properties']['id'], this.startYear).then((response) => {
          return response;
        }).then((data) => {

          this.fieldTypes = data.results.fieldCharacteristics;

        }).catch((error) => {
          console.log(error);
        });
      }
    );

    // subscribe to the end year selection by the user
    this.subscriptionToSelectedEndYear = this.userSelectionService.endYear$.subscribe(
      endYear => {

        this.endYear = endYear;

        // initialize the image characteristic options (and other options)
        starsAPIService.fetchImageCharacteristics(this.studyArea['properties']['id'], this.startYear, this.endYear).then((response) => {
          return response;
        }).then((data) => {

          this.allSpectralCharacteristicObjects = data.results.spectralCharacteristics;
          this.allTexturalCharacteristicObjects = data.results.texturalCharacteristics;
          this.characteristicTypes = ['Image Characteristic', 'Field Characteristic'];
          this.imageTypes = ['Spectral', 'Textural'];

        }).catch((error) => {
          console.log(error);
        });

        // initialize field characteristic options
        this.starsAPIService.fetchFieldCharacteristics(this.studyArea['properties']['id'], this.startYear, this.endYear).then((response) => {
          return response;
        }).then((data) => {

          this.fieldTypes = data.results.fieldCharacteristics;

        }).catch((error) => {
          console.log(error);
        });
      }
    );

    // subscribe to crop types selections by the user
    this.subscriptionToSelectedCropTypes = this.userSelectionService.cropTypes$.subscribe(
      cropTypes => {

        let cropList = '';
        cropTypes.forEach(function(item, index) {
          if (index === cropTypes.length - 1) {
            cropList += cropTypes[index];
          } else {
            cropList += cropTypes[index] + ',';
          }
        });
        this.cropTypes = cropList;
      }
    );
  }

  ngOnInit() {

    // fill out charts with test data
    this.createTestCharts();
  }

  ngOnDestroy() {
    this.subscriptionToSelectedStudyArea.unsubscribe();
    this.subscriptionToSelectedStartYear.unsubscribe();
    this.subscriptionToSelectedEndYear.unsubscribe();
    this.subscriptionToSelectedCropTypes.unsubscribe();
  }

  /**
   * Utility for creating a unique set of image characteristic names.
   * @param imageCharacteristics
   */
  createSetOfCharacteristicNames(imageCharacteristics: any[]) {
    const uniqueCharacteristicNames = new Set();
    imageCharacteristics.forEach(function(item) {
      uniqueCharacteristicNames.add(item.alias);
    });

    return Array.from(uniqueCharacteristicNames);
  }

  /**
   * Utility for fetching the image characteristic id associated with the input image characteristic name.
   * @param imageCharacteristicName
   * @param allImageCharacteristics
   * @returns {number}
   */
  fetchImageCharacteristicId(imageCharacteristicName: string, allImageCharacteristics: any[]): number {
    let targetId: number = undefined;
    allImageCharacteristics.forEach(function(item){
      if (item.alias === imageCharacteristicName) {
        targetId = item.oid;
      }
    });
    return targetId;
  }

  /**
   * Utility for fetching a unique list of sensors for the chosen image characteristic (spectral or textural).
   * @param imageCharacteristicAlias
   * @param allImageCharacteristics
   * @returns {string[]}
   */
  fetchSensorsForImageCharacteristic(imageCharacteristicAlias: string, allImageCharacteristics: any[]): string[] {
    const results: string[] = [];
    allImageCharacteristics.forEach(function(item) {
      if (item.alias === imageCharacteristicAlias) {
        results.push(item.sensor);
      }
    });
    return results;
  }

  /**
   * Utility for fetching a random color for drawing lines.
   * @returns {string}
   */
  fetchRandomColor() {
    const colors = ['#6A7f00', '#D26F51', '#D59F2E', '#00577F', '#C548C0'];
    const randomIndex = this.randomIntFromInterval(0, 4);
    return colors[randomIndex];
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Utility for fetching a complimentary background color for the input line color.
   * @param lineColor
   * @returns {any}
   */
  fetchBackgroundColor(lineColor) {

    let backgroundColor: string;

    if (lineColor === '#6A7f00') {
      backgroundColor = 'rgba(106, 127, 0, 0.2)';
    } else if (lineColor === '#D26F51') {
      backgroundColor = 'rgba(210, 111, 82, 0.2)';
    } else if (lineColor === '#D59F2E') {
      backgroundColor = 'rgba(213, 159, 46, 0.2)';
    } else if (lineColor === '#00577F') {
      backgroundColor = 'rgba(0, 87, 127, 0.2)';
    } else if (lineColor === '#C548C0') {
      backgroundColor = 'rgba(197, 72, 192, 0.2)';
    }

    return backgroundColor;
  }

  /**
   * Utility for rendering the image characteristics chart for the time series response.
   * @param {any[]} results
   * @param {string} xAxisTitle
   * @param {string} yAxisTitle
   * @param {string} targetDivId
   */
  renderImageCharacteristicTimeSeriesChart(results: any[], xAxisTitle: string, yAxisTitle: string, targetDivId: string) {
    const chartData = [];

    for (const item of results) {
      const cropName = item.crop;

      for (const crop of item.cseries) {
        const dateCollection = [];
        const avgValueCollection = [];
        const maxValueCollection = [];
        const minValueCollection = [];

        for (const sensor of crop.sseries) {
          dateCollection.push(sensor.acquisition_date);
          avgValueCollection.push(sensor.avgvalue);
          maxValueCollection.push(sensor.maxvalue);
          minValueCollection.push(sensor.minvalue);
        }

        // chart's line
        const lineColor = this.fetchRandomColor();
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
        for (let i = maxValueCollection.length - 1, il = 0; i >= il; i--) {
          envelopeY.push(maxValueCollection[i]);
        }

        const envelopeX = dateCollection;
        for (let j = dateCollection.length - 1, jl = 0; j >= jl; j--) {
          envelopeX.push(dateCollection[j]);
        }

        const backgroundColor = this.fetchBackgroundColor(lineColor);
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
        const lineColor = this.fetchRandomColor();
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
        for (let i = maxValueCollection.length - 1, il = 0; i >= il; i--) {
          envelopeY.push(maxValueCollection[i]);
        }

        const envelopeX = dateCollection;
        for (let j = dateCollection.length - 1, jl = 0; j >= jl; j--) {
          envelopeX.push(dateCollection[j]);
        }

        const backgroundColor = this.fetchBackgroundColor(lineColor);
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
        const lineColor = this.fetchRandomColor();
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
    if (this.chart1SelectedImageCharacteristicName !== undefined) {
      this.chart1SelectedImageCharacteristicName = undefined;
    }
    if (this.selectedChart1Sensor !== undefined) {
      this.selectedChart1Sensor = undefined;
    }

    // add image characteristic drop down items
    if (this.chart1SelectedImageType === 'Spectral') {
      this.chart1ImageCharacteristics = this.createSetOfCharacteristicNames(this.allSpectralCharacteristicObjects);
    } else {
      this.chart1ImageCharacteristics = this.createSetOfCharacteristicNames(this.allTexturalCharacteristicObjects);
    }
  }

  /**
   * Handles when user chooses an image characteristic for Chart 1.
   */
  onChart1ImageCharacteristicChange() {

    // clear previous dependent selection for sensor
    if (this.selectedChart1Sensor !== undefined) {
      this.selectedChart1Sensor = undefined;
    }

    // add sensor drop down items
    if (this.chart1SelectedImageType === 'Spectral') {

      // load sensor drop down options
      this.chart1Sensors = this.fetchSensorsForImageCharacteristic(this.chart1SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart1SelectedImageCharacteristicId  = this.fetchImageCharacteristicId(this.chart1SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);
    } else {

      // load sensor drop down options
      this.chart1Sensors = this.fetchSensorsForImageCharacteristic(this.chart1SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart1SelectedImageCharacteristicId  = this.fetchImageCharacteristicId(this.chart1SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);
    }
  }

  /**
   * Handles when a user chooses a sensor for Chart 1.
   */
  onChart1SensorChange() {
    this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropTypes, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor).then((response) => {
      return response;
    }).then((data) => {
      const results = data.results;
      this.renderImageCharacteristicTimeSeriesChart(results, this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName, 'chart1');
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
    this.starsAPIService.fetchFieldCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropTypes, this.chart1SelectedFieldCharacteristicId).then((response) => {
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
      this.chart2ImageCharacteristics = this.createSetOfCharacteristicNames(this.allSpectralCharacteristicObjects);
    } else {
      this.chart2ImageCharacteristics = this.createSetOfCharacteristicNames(this.allTexturalCharacteristicObjects);
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
      this.chart2Sensors = this.fetchSensorsForImageCharacteristic(this.chart2SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart2SelectedImageCharacteristicId  = this.fetchImageCharacteristicId(this.chart2SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);
    } else {

      // load sensor drop down options
      this.chart2Sensors = this.fetchSensorsForImageCharacteristic(this.chart2SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart2SelectedImageCharacteristicId  = this.fetchImageCharacteristicId(this.chart2SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);
    }
  }

  /**
   * Handles when a user chooses a sensor for Chart 2.
   */
  onChart2SensorChange() {
    this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropTypes, this.chart2SelectedImageCharacteristicId, this.selectedChart2Sensor).then((response) => {
      return response;
    }).then((data) => {
      const results = data.results;
      this.renderImageCharacteristicTimeSeriesChart(results, this.chart2SelectedImageType, this.chart2SelectedImageCharacteristicName, 'chart2');
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
    this.starsAPIService.fetchFieldCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropTypes, this.chart2SelectedFieldCharacteristicId).then((response) => {
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
   * Utility for testing patterns for creating chart spec.
   */
  createTestCharts() {

    // ----------------------
    //  CHART 1 PLACEHOLDER
    // ----------------------

    const milletSpectralLineEnvelope = {
      x: ['142d', '150d', '177d', '210d', '291d', '305d', '318d', '318d', '305d', '291d', '210d', '177d', '150d', '142d'],
      y: [0.15, 0.15, 0.2, 0.43, 0.44, 0.31, 0.27, 0.3, 0.34, 0.48, 0.48, 0.25, 0.19, 0.17],
      fill: 'tozerox',
      fillcolor: 'rgba(0, 100, 80, 0.2)',
      name: 'Millet Envelope',
      showlegend: false,
      type: 'scatter',
      line: {color: 'transparent'}
    };

    // data for millet spectral test sample
    const milletSpectralLine = {
      x: ['142d', '150d', '177d', '210d', '291d', '305d', '318d'],
      y: [0.163984678685665, 0.163497392833233, 0.224976481497288, 0.455028122663498, 0.464507251977921, 0.321201853454113, 0.28456095457077],
      mode: 'lines',
      name: 'Millet',
      line: {
        color: '#6A7F00',
        width: 3
      },
      type: 'scatter'
    };

    // layout for millet spectral test sample
    const milletSpectralLayout = {
      title: 'Spectral Time Series',
      xaxis: {
        title: 'Time',
        showgrid: true,
        zeroline: true,
        ticks: 'outside',
        showticklabels: true
      },
      yaxis: {
        title: 'NDVI average',
        showline: false,
        ticks: 'outside',
        showticklabels: true
      },
      hovermode: 'closest'
    };

    // spectral chart for millet
    const milletSpectralData = [milletSpectralLineEnvelope, milletSpectralLine];
    Plotly.newPlot('chart1',
      milletSpectralData,
      milletSpectralLayout,
      {
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines'],
        displaylogo: false
      }
    );

    // ----------------------
    //  CHART 2 PLACEHOLDER
    // ----------------------

    // data for millet textural test sample
    const milletTexturalLine = {
      x: ['142d', '150d', '177d', '210d', '291d', '305d', '318d'],
      y: [0.429646278731525, 0.471472800523043, 0.353645605966449, 0.313254946377128, 0.240355986077338, 0.235981020890176, 0.218380955606699],
      mode: 'lines',
      name: 'Maize',
      line: {
        color: '#2673A8',
        width: 3
      }
    };

    // layout for millet textural test sample
    const milletTexturalLayout = {
      title: 'Textural Time Series',
      xaxis: {
        title: 'Time',
        showgrid: true,
        zeroline: true
      },
      yaxis: {
        title: 'Homogeneity at distance D',
        showline: false
      },
      hovermode: 'closest'
    };

    const milletTexturalData = [milletTexturalLine];
    Plotly.newPlot('chart2',
      milletTexturalData,
      milletTexturalLayout,
      {
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines'],
        displaylogo: false
      }
    );
  }
}
