import { Component, OnInit } from '@angular/core';
import { StarsAPIService } from '../services/stars-api.service';

declare let Plotly: any;

@Component({
  selector: 'app-image-characteristic-section',
  templateUrl: './image-characteristic-section.component.html',
  styleUrls: ['./image-characteristic-section.component.css']
})
export class ImageCharacteristicSectionComponent implements OnInit {

  /**
   * Properties
   */

  imageTypes: string[] = ["Spectral", "Textural"];
  selectedChart1ImageType: string = null;
  selectedChart2ImageType: string = null;

  allSpectralCharacteristicObjects: any[] = [];
  selectedSpectralCharacteristicName: string = null;
  selectedSpectralCharacteristicId: number = null;
  spectralCharacteristics: any[] = [];

  allTexturalCharacteristicObjects: any[] = [];
  selectedTexturalCharacteristicName: string = null;
  selectedTexturalCharacteristicId: number = null;
  texturalCharacteristics: any[] = [];

  selectedSensor: string = null;
  sensors: any[] = [];

  /**
   * Component Life-cycle methods
   */
  constructor(private starsAPIService: StarsAPIService) {

    // fetch image characteristics
    starsAPIService.fetchImageCharacteristics(1000, 2014).then((response) => {     // TODO - REMOVE HARD-CODED TEST
      return response;
    }).then((data) => {
      let results = data.results;
      this.initializeSpectralCharacteristics(results);
      this.initializeTexturalCharacteristics(results);
    }).catch((error) => {
      console.log(error);
    });
  }

  ngOnInit() {
    this.createTestCharts();
  }

  /**
   * Utility that creates a unique set of spectral characteristic names
   * @param results
   */
  initializeSpectralCharacteristics(results: any) {

    // fetch all unique spectral characteristic alias names
    this.allSpectralCharacteristicObjects = results.spectralCharacteristics;
    let uniqueSpectralCharacteristicNames = new Set();
    this.allSpectralCharacteristicObjects.forEach(function(item) {
      uniqueSpectralCharacteristicNames.add(item.alias);
    });
    this.spectralCharacteristics = Array.from(uniqueSpectralCharacteristicNames);
  }

  /**
   * Utility that creates a unique set of textural characteristic names
   * @param results
   */
  initializeTexturalCharacteristics(results: any) {

    // fetch all unique textural characteristics alias names
    this.allTexturalCharacteristicObjects = results.texturalCharacteristics;
    let uniqueTexturalCharacteristicNames = new Set();
    this.allTexturalCharacteristicObjects.forEach(function(item) {
      uniqueTexturalCharacteristicNames.add(item.alias);
    });
    this.texturalCharacteristics = Array.from(uniqueTexturalCharacteristicNames);
  }

  /**
   * Handles when user chooses an image type for Chart 1
   */
  onChart1ImageTypeChange() {

    console.log("User chose image type: " + this.selectedChart1ImageType + " for chart 1");
  }

  /**
   * Handles when user chooses an image type for Chart 2
   */
  onChart2ImageTypeChange() {
    console.log("User chose image type: " + this.selectedChart2ImageType + " for chart 2");
  }

  /**
   * Handles when user chooses a spectral characteristic
   */
  onSpectralCharacteristicChange() {
    this.selectedSpectralCharacteristicId = this.fetchImageCharacteristicId(this.selectedSpectralCharacteristicName, this.allSpectralCharacteristicObjects);
    this.sensors = this.fetchSensorsForImageCharacteristic(this.selectedSpectralCharacteristicName, this.allSpectralCharacteristicObjects);

    //
    console.log(this.allSpectralCharacteristicObjects);
  }

  /**
   * Handles when a user chooses a textural characteristic
   */
  onTexturalCharacteristicChange() {
    this.sensors = this.fetchSensorsForImageCharacteristic(this.selectedTexturalCharacteristicName, this.allTexturalCharacteristicObjects);
  }

  /**
   * Utility for fetching the spectral characteristic id associated with the input spectral characteristic
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
    let results: string[] = [];
    allImageCharacteristics.forEach(function(item) {
      if (item.alias == imageCharacteristicAlias) {
        results.push(item.sensor);
      }
    });
    return results;
  }

  /**
   * Handles when a user chooses a sensor
   */
  onSensorChange() {

    let studyArea = 1000; // TODO - REMOVE HARD-CODED TEST
    let startYear = 2014; // TODO - REMOVE HARD-CODED TEST
    let endYear = 2014; // TODO - REMOVE HARD-CODED TEST
    let cropNames = "Millet"; // TODO - REMOVE HARD-CODED TEST
    let imageCharacteristicId = null;
    if (this.selectedSpectralCharacteristicId != null) {
      imageCharacteristicId = this.selectedSpectralCharacteristicId;
    }
    else {
      imageCharacteristicId = this.selectedTexturalCharacteristicId;
    }
    let sensorList = "WorldView-2_MS"; // TODO - REMOVE HARD-CODED TEST
    let firstParameter = null; // TODO - REMOVE HARD-CODED TEST
    let secondParameter = null; // TODO - REMOVE HARD-CODED TEST

    this.starsAPIService.fetchTimeSeries(studyArea, startYear, endYear, cropNames, imageCharacteristicId, sensorList, firstParameter, secondParameter).then((response) => {
      return response;
    }).then((data) => {
      console.log('time series');
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Utility for testing patterns for creating chart spec
   */
  createTestCharts() {

    //----------------------
    //  CHART 1 PLACEHOLDER
    //----------------------

    let milletSpectralLineEnvelope = {
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
    let milletSpectralLine = {
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
    let milletSpectralLayout = {
      title: "SPECTRAL TIME SERIES",
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
      }
    };

    // spectral chart for millet
    let milletSpectralData = [milletSpectralLineEnvelope, milletSpectralLine];
    Plotly.newPlot('ndviChart', milletSpectralData, milletSpectralLayout);

    //----------------------
    //  CHART 2 PLACEHOLDER
    //----------------------

    // data for millet textural test sample
    let milletTexturalLine = {
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
    let milletTexturalLayout = {
      title: "TEXTURAL TIME SERIES",
      xaxis: {
        title: 'Time',
        showgrid: true,
        zeroline: true
      },
      yaxis: {
        title: 'Homogeneity at distance D',
        showline: false
      }
    };

    let milletTexturalData = [milletTexturalLine];
    Plotly.newPlot('texturalChart', milletTexturalData, milletTexturalLayout);
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
    console.log('add a chart ...');
  }
}
