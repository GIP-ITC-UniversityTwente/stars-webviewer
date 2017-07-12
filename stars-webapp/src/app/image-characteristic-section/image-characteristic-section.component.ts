import { Component, OnInit, OnDestroy } from '@angular/core';
import { StarsAPIService } from '../services/stars-api.service';
import { Subscription } from 'rxjs/Subscription';
import { UserSelectionService } from '../services/user-selection.service';

declare let Plotly: any;

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
  cropTypes: string[] = [];

  imageTypes: string[] = ["Spectral", "Textural"];

  allSpectralCharacteristicObjects: any[] = [];
  allTexturalCharacteristicObjects: any[] = [];

  chart1SelectedImageType: string = null;
  chart1ImageCharacteristics: any[] = [];
  chart1SelectedImageCharacteristicName: string = null;
  chart1SelectedImageCharacteristicId: number = null;
  chart1Sensors: any[] = [];
  selectedChart1Sensor: string = null;

  chart2SelectedImageType: string = null;
  chart2SpectralCharacteristics: any[] = [];
  chart2SelectedSpectralCharacteristicName: string = null;
  chart2SelectedSpectralCharacteristicId: number = null;
  chart2TexturalCharacteristics: any[] = [];
  chart2SelectedTexturalCharacteristicName: string = null;
  chart2SelectedTexturalCharacteristicId: number = null;
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
        //
        console.log('image characteristic section knows study area is: ' + this.studyArea);
      }
    );

    // subscribe to the start year selection by the user
    this.subscriptionToSelectedStartYear = this.userSelectionService.startYear$.subscribe(
      startYear => {
        this.startYear = startYear;
        //
        console.log('image characteristic section knows start year is: ' + this.startYear);

        starsAPIService.fetchImageCharacteristics(this.studyArea["properties"]["id"], this.startYear).then((response) => {
          return response;
        }).then((data) => {
          let results = data.results;
          this.allSpectralCharacteristicObjects = results.spectralCharacteristics;
          this.allTexturalCharacteristicObjects = results.texturalCharacteristics;
        }).catch((error) => {
          console.log(error);
        });
      }
    );

    // subscribe to the end year selection by the user
    this.subscriptionToSelectedEndYear = this.userSelectionService.endYear$.subscribe(
      endYear => {
        this.endYear = endYear;
        //
        console.log('image characteristic section knows end year is: ' + this.endYear);

        starsAPIService.fetchImageCharacteristics(this.studyArea["properties"]["id"], this.startYear ,this.endYear).then((response) => {
          return response;
        }).then((data) => {
          let results = data.results;
          this.allSpectralCharacteristicObjects = results.spectralCharacteristics;
          this.allTexturalCharacteristicObjects = results.texturalCharacteristics;
        }).catch((error) => {
          console.log(error);
        });
      }
    );

    // subscribe to crop types selections by the user
    this.subscriptionToSelectedCropTypes = this.userSelectionService.cropTypes$.subscribe(
      cropTypes => {
        this.cropTypes = cropTypes;
        //
        console.log('image characteristic section knows crop types are: ' + this.cropTypes);
      }
    );
  }

  ngOnInit() {
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

    let uniqueCharacteristicNames = new Set();
    imageCharacteristics.forEach(function(item) {
      uniqueCharacteristicNames.add(item.alias);
    });

    return Array.from(uniqueCharacteristicNames);
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

    console.log("The following parameters will be sent to the time series endpoint: ");
    console.log("study area: " + this.studyArea["properties"]["name"]);
    console.log("start year: " + this.startYear);
    console.log("end Year: " + this.endYear);
    console.log("chart1 image characteristic name: " + this.chart1SelectedImageCharacteristicName);
    console.log("chart1 image characteristic id: " + this.chart1SelectedImageCharacteristicId);
    console.log("chart 1 sensor: " + this.selectedChart1Sensor);

    /*
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
     */
  }

  /**
   * Handles when user chooses an image type for Chart 2
   */
  onChart2ImageTypeChange() {
    console.log("User chose image type: " + this.chart2SelectedImageType + " for chart 2");
    if(this.chart2SelectedImageType == "Spectral") {
      // load spectral characteristics
    }
    else {
      // load textural characteristics
    }
  }

  /**
   * Handles when a user chooses a textural characteristic
   */
  onTexturalCharacteristicChange() {
    /*
    this.sensors = this.fetchSensorsForImageCharacteristic(this.selectedTexturalCharacteristicName, this.allTexturalCharacteristicObjects);
    */
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
    let results: string[] = [];
    allImageCharacteristics.forEach(function(item) {
      if (item.alias == imageCharacteristicAlias) {
        results.push(item.sensor);
      }
    });
    return results;
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
