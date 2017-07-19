import { Component, OnInit, OnDestroy } from '@angular/core';
import { StarsAPIService } from '../services/stars-api.service';
import { Subscription } from 'rxjs/Subscription';
import { UserSelectionService } from '../services/user-selection.service';

declare const Plotly: any;

@Component({
  selector: 'app-image-characteristic-section',
  templateUrl: './image-characteristic-section.component.html',
  styleUrls: ['./image-characteristic-section.component.css']
})
export class ImageCharacteristicSectionComponent implements OnInit, OnDestroy {

  /**
   * Properties
   */

  subscriptionToSelectedStudyArea: Subscription;
  studyArea: JSON;
  subscriptionToSelectedStartYear: Subscription;
  startYear: number = null;
  subscriptionToSelectedEndYear: Subscription;
  endYear: number = null;
  subscriptionToSelectedCropTypes: Subscription;
  cropTypes: string = null;

  imageTypes: string[] = [];
  allSpectralCharacteristicObjects: any[] = [];
  allTexturalCharacteristicObjects: any[] = [];

  chart1SelectedImageType: string = null;
  chart1ImageCharacteristics: any[] = [];
  chart1SelectedImageCharacteristicName: string = null;
  chart1SelectedImageCharacteristicId: number = null;
  chart1Sensors: any[] = [];
  selectedChart1Sensor: string = null;

  chart2SelectedImageType: string = null;
  chart2ImageCharacteristics: any[] = [];
  chart2SelectedImageCharacteristicName: string = null;
  chart2SelectedImageCharacteristicId: number = null;
  chart2Sensors: any[] = [];
  selectedChart2Sensor: string = null;

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
        starsAPIService.fetchImageCharacteristics(this.studyArea["properties"]["id"], this.startYear).then((response) => {
          return response;
        }).then((data) => {
          this.allSpectralCharacteristicObjects = data.results.spectralCharacteristics;
          this.allTexturalCharacteristicObjects = data.results.texturalCharacteristics;

          // let user choose an image type after the image characteristic response arrives at the client (this takes a while)
          this.imageTypes = ["Spectral", "Textural"];

        }).catch((error) => {
          console.log(error);
        });
      }
    );

    // subscribe to the end year selection by the user
    this.subscriptionToSelectedEndYear = this.userSelectionService.endYear$.subscribe(
      endYear => {

        this.endYear = endYear;
        starsAPIService.fetchImageCharacteristics(this.studyArea["properties"]["id"], this.startYear ,this.endYear).then((response) => {
          return response;
        }).then((data) => {
          this.allSpectralCharacteristicObjects = data.results.spectralCharacteristics;
          this.allTexturalCharacteristicObjects = data.results.texturalCharacteristics;

          // let user choose an image type after the image characteristic response arrives at the client (this takes a while)
          this.imageTypes = ["Spectral", "Textural"];

        }).catch((error) => {
          console.log(error);
        });
      }
    );

    // subscribe to crop types selections by the user
    this.subscriptionToSelectedCropTypes = this.userSelectionService.cropTypes$.subscribe(
      cropTypes => {

        let cropList: string = "";
        cropTypes.forEach(function(item, index) {
          if(index == cropTypes.length) {
            cropList += cropTypes[index];
          }
          else {
            cropList += cropTypes[index] + ",";
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
   * Utility for creating a unique set of image characteristic names
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
   * Utility for fetching the image characteristic id associated with the input image characteristic name
   * @param imageCharacteristicName
   * @param allImageCharacteristics
   * @returns {number}
   */
  fetchImageCharacteristicId(imageCharacteristicName: string, allImageCharacteristics: any[]): number {
    let targetId: number = null;
    allImageCharacteristics.forEach(function(item){
      if (item.alias == imageCharacteristicName) {
        targetId = item.oid;
      }
    });
    return targetId;
  }

  /**
   * Utility for fetching a unique list of sensors for the chosen image characteristic (spectral or textural)
   * @param imageCharacteristicAlias
   * @param allImageCharacteristics
   * @returns {string[]}
   */
  fetchSensorsForImageCharacteristic(imageCharacteristicAlias: string, allImageCharacteristics: any[]): string[] {
    const results: string[] = [];
    allImageCharacteristics.forEach(function(item) {
      if (item.alias == imageCharacteristicAlias) {
        results.push(item.sensor);
      }
    });
    return results;
  }

  /**
   * Utility for fetching a random color for drawing lines
   * @returns {string}
   */
  fetchRandomColor() {
    const colors = ['#6A7f00', '#D26F51', '#D59F2E', '#00577F', '#C548C0'];
    let randomIndex = this.randomIntFromInterval(0, 4);
    return colors[randomIndex];
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  /**
   * Utility for fetching a complimentary background color for the input line color
   * @param lineColor
   * @returns {any}
   */
  fetchBackgroundColor(lineColor) {

    let backgroundColor: string;

    if(lineColor == '#6A7f00') {
      backgroundColor = 'rgba(106, 127, 0, 0.2)';
    }
    else if (lineColor == '#D26F51') {
      backgroundColor = 'rgba(210, 111, 82, 0.2)';
    }
    else if (lineColor == '#D59F2E') {
      backgroundColor = 'rgba(213, 159, 46, 0.2)';
    }
    else if (lineColor == '#00577F') {
      backgroundColor = 'rgba(0, 87, 127, 0.2)';
    }
    else if (lineColor == '#C548C0') {
      backgroundColor = 'rgba(197, 72, 192, 0.2)';
    }

    return backgroundColor;
  }

  /**
   * Utility for rendering the image characteristics chart for the time series response
   * @param {any[]} results
   * @param {string} xAxisTitle
   * @param {string} yAxisTitle
   * @param {string} targetDivId
   */
  renderTimeSeriesChart(results: any[], xAxisTitle: string, yAxisTitle: string, targetDivId: string) {
    const chartData = [];

    for(const item of results) {
      const cropName = item.crop;

      for(const crop of item.cseries) {
        const dateCollection = [];
        const avgValueCollection = [];
        const maxValueCollection = [];
        const minValueCollection = [];

        for(const sensor of crop.sseries) {
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
          fill: "tozerox",
          fillcolor: backgroundColor,
          name: '',
          showlegend: false,
          type: "scatter",
          line: {color: "transparent"}
        };

        // add line & envelope to chart data
        chartData.push(envelopeDataObject);
        chartData.push(lineDataObject);
      }
    }

    // layout for millet spectral test sample
    const layout = {
      title: xAxisTitle + " Time Series",
      xaxis: {
        title: 'Time',
        showgrid: true,
        zeroline: true,
        ticks: "outside",
        showticklabels: true
      },
      yaxis: {
        title: yAxisTitle,
        showline: false,
        ticks: "outside",
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
   * Handles when user chooses an image type for Chart 1
   */
  onChart1ImageTypeChange() {

    // clear previous dependent selections for image characteristic and sensor
    if(this.chart1SelectedImageCharacteristicName != null) {
      this.chart1SelectedImageCharacteristicName = null;
    }
    if(this.selectedChart1Sensor != null) {
      this.selectedChart1Sensor = null;
    }

    // add image characteristic drop down items
    if(this.chart1SelectedImageType == "Spectral") {
      this.chart1ImageCharacteristics = this.createSetOfCharacteristicNames(this.allSpectralCharacteristicObjects);
    }
    else {
      this.chart1ImageCharacteristics = this.createSetOfCharacteristicNames(this.allTexturalCharacteristicObjects);
    }
  }

  /**
   * Handles when user chooses an image characteristic for Chart 1
   */
  onChart1ImageCharacteristicChange() {

    // clear previous dependent selection for sensor
    if(this.selectedChart1Sensor != null) {
      this.selectedChart1Sensor = null;
    }

    // add sensor drop down items
    if(this.chart1SelectedImageType == "Spectral") {

      // load sensor drop down options
      this.chart1Sensors = this.fetchSensorsForImageCharacteristic(this.chart1SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart1SelectedImageCharacteristicId  = this.fetchImageCharacteristicId(this.chart1SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);
    }
    else {

      // load sensor drop down options
      this.chart1Sensors = this.fetchSensorsForImageCharacteristic(this.chart1SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart1SelectedImageCharacteristicId  = this.fetchImageCharacteristicId(this.chart1SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);
    }
  }

  /**
   * Handles when a user chooses a sensor for Chart 1
   */
  onChart1SensorChange() {
    this.starsAPIService.fetchTimeSeries(this.studyArea["properties"]["id"], this.startYear, this.endYear, this.cropTypes, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor, null, null).then((response) => {
      return response;
    }).then((data) => {
      const results = data.results;
      this.renderTimeSeriesChart(results, this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName, 'chart1');
    });
  }

  /**
   * Handles when user chooses an image type for Chart 2
   */
  onChart2ImageTypeChange() {

    // clear previous dependent selections for image characteristic and sensor
    if(this.chart2SelectedImageCharacteristicName != null) {
      this.chart2SelectedImageCharacteristicName = null;
    }

    if(this.selectedChart2Sensor != null) {
      this.selectedChart2Sensor = null;
    }

    // add image characteristic drop down items
    if(this.chart2SelectedImageType == "Spectral") {
      this.chart2ImageCharacteristics = this.createSetOfCharacteristicNames(this.allSpectralCharacteristicObjects);
    }
    else {
      this.chart2ImageCharacteristics = this.createSetOfCharacteristicNames(this.allTexturalCharacteristicObjects);
    }
  }

  /**
   * Handles when user chooses an image characteristic for Chart 2
   */
  onChart2ImageCharacteristicChange() {

    // clear previous dependent selection for sensor
    if(this.selectedChart2Sensor != null) {
      this.selectedChart2Sensor = null;
    }

    // add sensor drop down items
    if(this.chart2SelectedImageType == "Spectral") {

      // load sensor drop down options
      this.chart2Sensors = this.fetchSensorsForImageCharacteristic(this.chart2SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart2SelectedImageCharacteristicId  = this.fetchImageCharacteristicId(this.chart2SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);
    }
    else {

      // load sensor drop down options
      this.chart2Sensors = this.fetchSensorsForImageCharacteristic(this.chart2SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart2SelectedImageCharacteristicId  = this.fetchImageCharacteristicId(this.chart2SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);
    }
  }

  /**
   * Handles when a user chooses a sensor for Chart 2
   */
  onChart2SensorChange() {
    this.starsAPIService.fetchTimeSeries(this.studyArea["properties"]["id"], this.startYear, this.endYear, this.cropTypes, this.chart2SelectedImageCharacteristicId, this.selectedChart2Sensor, null, null).then((response) => {
      return response;
    }).then((data) => {
      const results = data.results;
      this.renderTimeSeriesChart(results, this.chart2SelectedImageType, this.chart2SelectedImageCharacteristicName, 'chart2');
    });
  }

  /**
   * Handles when user taps on info icon for Image Characteristics
   */
  handleInfoButtonTap() {
    console.log('show info for image characteristics...');
  }

  /**
   * Handles when user taps on the 'add a chart' button
   */
  handleAddChartButtonTap() {
    //TODO ADD SECOND CHART
  }

  /**
   * Utility for testing patterns for creating chart spec
   */
  createTestCharts() {

    //----------------------
    //  CHART 1 PLACEHOLDER
    //----------------------

    const milletSpectralLineEnvelope = {
      x: ['142d', '150d', '177d', '210d', '291d', '305d', '318d', '318d', '305d', '291d', '210d', '177d', '150d', '142d'],
      y: [0.15, 0.15, 0.2, 0.43, 0.44, 0.31, 0.27, 0.3, 0.34, 0.48, 0.48, 0.25, 0.19, 0.17],
      fill: "tozerox",
      fillcolor: "rgba(0, 100, 80, 0.2)",
      name: 'Millet Envelope',
      showlegend: false,
      type: "scatter",
      line: {color: "transparent"}
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
      type: "scatter"
    };

    // layout for millet spectral test sample
    const milletSpectralLayout = {
      title: "Spectral Time Series",
      xaxis: {
        title: 'Time',
        showgrid: true,
        zeroline: true,
        ticks: "outside",
        showticklabels: true
      },
      yaxis: {
        title: 'NDVI average',
        showline: false,
        ticks: "outside",
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

    //----------------------
    //  CHART 2 PLACEHOLDER
    //----------------------

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
      title: "Textural Time Series",
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
