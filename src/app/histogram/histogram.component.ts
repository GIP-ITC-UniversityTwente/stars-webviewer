import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AppConfiguration } from '../app-configuration';
import { HistogramBuilderService } from '../services/histogram-builder.service';
import { StarsAPIService } from '../services/stars-api.service';
import { UserSelectionService } from '../services/user-selection.service';

declare const Plotly: any;
declare const geostats: any;

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.css']
})
export class HistogramComponent implements OnInit {

  /**
   * Properties
   */

  subscriptionToSelectedStudyArea: Subscription;
  studyArea: JSON;
  subscriptionToSelectedStartYear: Subscription;
  startYear: number;
  subscriptionToSelectedEndYear: Subscription;
  endYear: number;
  subscriptionToSelectedCropTypes: Subscription;
  cropTypes: string;

  selectedFieldConstantCharacteristicId: number;
  fieldConstantCharacteristics: any[] = [];
  selectedNumberOfBins: number;
  numberOfBins: number[] = [];
  selectedClassificationMethod: string;
  classificationMethods: string[] = [];
  selectedClassSize: number;
  classSizes: number[] = [1, 2, 3, 4, 5];
  frequencyData: number[] = [];
  geostatSeries: any;
  toolTipPosition = 'right';
  fieldConstantsToolTip = AppConfiguration.fieldConstantsToolTip;

  /**
   * For dependency injecting needed services.
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
      }
    );

    // subscribe to the end year selection by the user
    this.subscriptionToSelectedEndYear = this.userSelectionService.endYear$.subscribe(
      endYear => {
        this.endYear = endYear;
      }
    );

    // subscribe to crop types selections by the user
    this.subscriptionToSelectedCropTypes = this.userSelectionService.cropTypes$.subscribe(
      cropTypes => {

        if (cropTypes.length === 0) {
          HistogramBuilderService.createEmptyHistogram(Plotly);
        } else if (cropTypes.length > 0) {

          // create the comma-delimited list of crops for an API request
          let cropList = '';
          cropTypes.forEach(function(item, index) {
            if (index === cropTypes.length - 1) {
              cropList += cropTypes[index];
            } else {
              cropList += cropTypes[index] + ',';
            }
          });
          this.cropTypes = cropList;

          // fetch field constant characteristics for drop down only after crops are chosen
          this.starsAPIService.fetchFieldConstantCharacteristic(this.studyArea['properties']['id'], this.startYear).then((response) => {
            return response;
          }).then((data) => {
            this.fieldConstantCharacteristics = data.results.fieldConstants;
          }).catch((error) => {
            console.log(error);
          });

          // make sure histogram is updated after crops are changed
          this.updateHistogram();
        }
      }
    );
  }

  /**
   * Life-cycle hook after component is created.
   */
  ngOnInit() {

    // set default selection
    //this.initializeDefaultSelection();
  }

  /**
   * For selecting default values for first load
   */
  /*
  initializeDefaultSelection() {

    // default field constant
    this.selectedFieldConstantCharacteristicId = 1015;

    // default field data sample
    const sampleData = {"message":"success","results":[{"i":1035,"v":0.772941},{"i":1090,"v":1.1164},{"i":1110,"v":0.9225},{"i":1125,"v":1.0576},{"i":1135,"v":1.5904},{"i":1140,"v":1.47579},{"i":1180,"v":1.2164},{"i":1210,"v":2.312},{"i":1240,"v":0.676781}]}
    for (const item of sampleData.results) {
      this.frequencyData.push(item['v']);
    }

    // present as un-classified histogram by default
    this.geostatSeries = new geostats(this.frequencyData);
    const histoData = HistogramBuilderService.createUnclassifiedHistogramDataObject(this.frequencyData);
    this.presentHistogramData(histoData, false);
  }
  */

  /**
   * For updating the histogram either after any global parameters change or after a field constant is changed.
   */
  updateHistogram() {

    /*
    // fetch field constants
    this.starsAPIService.fetchFieldConstantData(this.studyArea['properties']['id'], this.startYear, this.endYear, this.selectedFieldConstantCharacteristicId, this.cropTypes).then((response) => {
      return response;
    }).then((data) => {

      // clear frequency data from a previously chosen field constant characteristic
      if (this.frequencyData.length > 0) {
        this.frequencyData = [];
      }

      // initialize (or update) frequency data
      for (const item of data.results) {
        this.frequencyData.push(item['v']);
      }

      this.geostatSeries = new geostats(this.frequencyData);
      if (this.selectedClassSize === undefined && this.selectedClassificationMethod === undefined) {

        //
        console.log('test...');
        console.log(this.frequencyData);
        console.log(this.frequencyData.length);

        // create a un-classified histogram
        const histoData = HistogramBuilderService.createUnclassifiedHistogramDataObject(this.frequencyData, this.frequencyData.length);
        this.presentHistogramData(histoData, false);

      } else {

        // classify the data
        HistogramBuilderService.classifySeries(this.selectedClassificationMethod, this.selectedClassSize, this.geostatSeries);

        // create histogram data
        const histoData = HistogramBuilderService.createClassifiedHistogramDataObject(this.frequencyData, this.geostatSeries.ranges);

        // display histogram data
        this.presentHistogramData(histoData, true);
      }

    }).catch((error) => {
      console.log(error);
      HistogramBuilderService.createEmptyHistogram(Plotly);
    });

    */
  }

  /**
   * For handling when a user changes the target field characteristic.
   */
  onFieldConstantChange() {

    //this.updateHistogram();


    console.log(this.selectedFieldConstantCharacteristicId);

    // fetch field constants
    this.starsAPIService.fetchFieldConstantData(this.studyArea['properties']['id'], this.startYear, this.endYear, this.selectedFieldConstantCharacteristicId, this.cropTypes).then((response) => {
      return response;
    }).then((data) => {

      // clear frequency data from a previously chosen field constant characteristic
      if (this.frequencyData.length > 0) {
        this.frequencyData = [];
      }

      // initialize (or update) frequency data
      for (const item of data.results) {
        this.frequencyData.push(item['v']);
      }

      // initialize the number of bins
      this.frequencyData.forEach((item, index) => {
        if(index >= 1) { // the value of 2 is the lowest number of bins allowed
          this.numberOfBins.push(index + 1);
        }
      });
    }).catch((error) => {
      console.log(error);
      HistogramBuilderService.createEmptyHistogram(Plotly);
    });
  }

  /**
   * For handling when a user changes the number of bins
   */
  onNumberOfBinsChange() {

    console.log('number of bins changed to', this.selectedNumberOfBins);

    this.geostatSeries = new geostats(this.frequencyData);

    // un-classified histogram ...
    if (this.selectedClassSize === undefined && this.selectedClassificationMethod === undefined) {

      // create a un-classified histogram
      const histoData = HistogramBuilderService.createUnclassifiedHistogramDataObject(this.frequencyData, this.selectedNumberOfBins);

      //
      console.log('testing histoData');
      console.log(histoData);
      console.log('vs ', this.selectedNumberOfBins);

      this.presentHistogramData(histoData, false);

    // classified histogram ...
    } else {

      // classify the data
      HistogramBuilderService.classifySeries(this.selectedClassificationMethod, this.selectedClassSize, this.geostatSeries);

      // create histogram data
      const histoData = HistogramBuilderService.createClassifiedHistogramDataObject(this.frequencyData, this.geostatSeries.ranges);

      // display histogram data
      this.presentHistogramData(histoData, true);
    }
  }

  /**
   * For handling when a user changes the number of classes when viewing the frequency data.
   */
  onClassSizeChange() {

    if (this.classificationMethods.length !== HistogramBuilderService.classificationMethods.length) {
      this.classificationMethods = HistogramBuilderService.classificationMethods;
    }
  }

  /**
   * For handling when a user changes the target classification when viewing the frequency data.
   */
  onClassificationChange() {

    // classify the data
    HistogramBuilderService.classifySeries(this.selectedClassificationMethod, this.selectedClassSize, this.geostatSeries);

    // create histogram data
    const histoData = HistogramBuilderService.createClassifiedHistogramDataObject(this.frequencyData, this.geostatSeries.ranges);

    // display histogram data
    this.presentHistogramData(histoData, true);
  }

  /**
   * Utility for looking up the Field Constant name (i.e. alias) for the input Field Constant id
   * @param {number} id
   */
  lookUpFieldConstantName(id: number) {
    let result: string = undefined;
    this.fieldConstantCharacteristics.forEach(function(item) {
      if (item.oid === id) {
        result = item.alias;
      }
    });
    return result;
  }

  /**
   * Utility for presenting a histogram for the input data
   * @param histogramData
   * @param {boolean} isShowing
   */
  presentHistogramData(histogramData: any, isShowing: boolean) {

    const targetFieldConstantAlias = this.lookUpFieldConstantName(this.selectedFieldConstantCharacteristicId);
    const layout = {
      title: 'Histogram of ' + targetFieldConstantAlias,
      yaxis: { title: 'Count'},
      bargap: 0.05,
      hovermode: 'closest',
      showlegend: isShowing
    };

    Plotly.newPlot('histogram',
      histogramData,
      layout,
      {
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines'],
        displaylogo: false
      }
    );
  }
}

