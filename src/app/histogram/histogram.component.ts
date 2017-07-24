import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AppConfiguration } from '../app-configuration';
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
  selectedClassificationMethod: string;
  classificationMethods: string[];
  selectedClassSize: number;
  classSizes: number[] = [1, 2, 3, 4, 5];
  frequencyData: number[] = [];
  geostatSeries: any;
  toolTipPosition = 'right';
  fieldConstantsToolTip = AppConfiguration.fieldConstantsToolTip;

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
      }
    );
  }

  ngOnInit() {
    this.createTestHistogram();
  }

  /**
   * For handling when a user taps the info button for field characteristics.
   */
  handleInfoButtonTap() {
    console.log('show info for field characteristics');
  }

  /**
   * For handling when a user changes the target field characteristic.
   */
  onFieldCharacteristicChange() {

    // fetch field constants data
    const studyAreaId = this.studyArea['properties']['id'];
    const startYear = this.startYear;
    const endYear = this.endYear;
    const selectedFieldConstantCharacteristicId = this.selectedFieldConstantCharacteristicId;
    const cropTypes = this.cropTypes;
    this.starsAPIService.fetchFieldConstantData(studyAreaId, startYear, endYear, selectedFieldConstantCharacteristicId, cropTypes).then((response) => {
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

      // create histogram
      if (this.selectedClassSize === undefined && this.selectedClassificationMethod === undefined) {

        // create a un-classified histogram
        this.geostatSeries = new geostats(this.frequencyData);
        const histoData = this.createUnclassifiedHistogramDataObject(this.frequencyData);
        this.createHistogram(histoData, false);
      } else {

        // create a classified histogram
        const histoData = this.createClassifiedHistogramDataObject(this.frequencyData);
        this.createHistogram(histoData, true);
      }

    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * For handling when a user changes the number of classes when viewing the frequency data.
   */
  onClassSizeChange() {

    // initialize classification methods in drop down
    this.classificationMethods = ['Jenks', 'Equal Interval', 'Quantile', 'Unique Values', 'Standard Deviation', 'Arithmetic Progression', 'Geometric Progression'];
  }

  /**
   * For handling when a user changes the target classification when viewing the frequency data.
   */
  onClassificationChange() {

    // create classified histogram
    const histoData = this.createClassifiedHistogramDataObject(this.frequencyData);
    this.createHistogram(histoData, true);
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
   * Utility for creating a histogram for the input series
   * @param histogramData
   */
  createHistogram(histogramData: any, isShowing: boolean) {

    const targetFieldConstantAlias = this.lookUpFieldConstantName(this.selectedFieldConstantCharacteristicId);
    const layout = {
      title: 'Histogram of `' + targetFieldConstantAlias + '`',
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

  /**
   * Utility for fetching numbers in the input series that are greater than or equal to the input start number and less then the input end number.
   * @param {number[]} series
   * @param {number} start
   * @param {number} end
   * @returns {Array}
   */
  static fetchValuesInRange(series: number[], start: number, end: number) {
    const result = [];
    const lastValue = series[series.length - 1];
    series.forEach((item) => {
      if (item >= start && item < end) {
        result.push(item);
      } else if (item === end && end === lastValue) {
        result.push(item);
      }
    });

    return result;
  }

  /**
   * Utility for creating an array that represents the counts of each value in the input number array.
   * @param {number[]} values
   * @returns {Array}
   */
  static fetchCountOfValues(values: number[]) {
    const result = [];

    // get unique values
    const uniqueValues = new Set(values);

    // get count of unique values
    uniqueValues.forEach(function(currentUniqueValue) {
      let count = 0;
      values.forEach(function(item) {
        if (item === currentUniqueValue) {
          count += 1;
        }
      });
      result.push(count);
    });

    return result;
  }

  /**
   * Utility for fetching a histogram color.
   * @param {number} index
   */
  static fetchHistogramColorForIndex(index: number) {
    if (index === 0) {
      return '#A1D99B';
    } else if (index === 1) {
      return '#74C476';
    } else if (index === 2) {
      return '#41AB5D';
    } else if (index === 3) {
      return '#238B45';
    } else if (index === 4) {
      return '005A32';
    }
  }

  /**
   * Utility for creating the data object for a classified histogram
   * @param {number[]} series
   */
  createClassifiedHistogramDataObject(series: number[]) {
    const result = [];

    //
    console.log(this.selectedClassificationMethod);

    if (this.selectedClassificationMethod === 'Jenks') {
      this.geostatSeries.getJenks(this.selectedClassSize);
    } else if (this.selectedClassificationMethod === 'Equal Interval') {
      this.geostatSeries.getClassEqInterval(this.selectedClassSize);
    } else if (this.selectedClassificationMethod === 'Quantile') {
      this.geostatSeries.getClassQuantile(this.selectedClassSize);
    } else if (this.selectedClassificationMethod === 'Unique Values') {
      this.geostatSeries.getClassUniqueValues(this.selectedClassSize);
    } else if (this.selectedClassificationMethod === 'Standard Deviation') {
      this.geostatSeries.getClassStdDeviation(this.selectedClassSize);
    } else if (this.selectedClassificationMethod === 'Arithmetic Progression') {
      this.geostatSeries.getClassArithmeticProgression(this.selectedClassSize);
    } else if (this.selectedClassificationMethod === 'Geometric Progression') {
      this.geostatSeries.getClassGeometricProgression(this.selectedClassSize);
    } else {
      this.geostatSeries.getJenks(this.selectedClassSize);
    }

    const sorted = series.sort((n1, n2) => n1 - n2);

    if (this.selectedClassSize > 0) {
      this.geostatSeries.ranges.forEach(function(item, index){

        // get the start and end values for the current range
        const sliced = item.split(' - ');
        const startRange = sliced[0];
        const endRange = sliced[1];

        //
        console.log('the range is: ' + startRange + ' to ' + endRange);

        // get the values in the series for the current range
        const values = HistogramComponent.fetchValuesInRange(sorted, startRange, endRange);

        //
        // console.log('the values are: ' + values);

        // get the count for each value
        const counts = HistogramComponent.fetchCountOfValues(values);

        //
        console.log('the counts are: ' + counts);

        // create color array (per Plotly spec)
        const targetColor = HistogramComponent.fetchHistogramColorForIndex(index);
        const colorArray = [];
        values.forEach(function(){
          colorArray.push(targetColor);
        });

        // create a frequency data item (per Plotly spec)
        const freqItem = {
          name: 'Class ' + index + ' (' + startRange + '-' + endRange + ')',
          x: values,
          type: 'histogram',
          marker: { color:  targetColor}
        };

        result.push(freqItem);
      });

      //
      // console.log('the histogram model');
      // console.log(result);
    }

    return result;
  }

  /**
   * Utility for creating the data object for an un-classified histogram
   * @param {number[]} series
   */
  createUnclassifiedHistogramDataObject(series: number[]) {

    // build histogram data object per the Plotly spec
    const result = [{
      x: series,
      type: 'histogram'
    }];

    return result;
  }

  /**
   * Creates a test histogram to demonstrate the general code required for the chart.
   */
  createTestHistogram() {

    // field based characteristic sample classification data
    const data = [
      {
        name: 'Medium Field',
        x: ['7000'],
        y: [2],
        type: 'bar',
        marker: {
          color: ['#A6A6A6']
        }
      },
      {
        name: 'Large Field',
        x: ['11000', '15000'],
        y: [3, 3],
        type: 'bar',
        marker: {
          color: ['#ED7D31', '#ED7D31']
        }
      }
      ,
      {
        name: 'Small Field',
        x: ['0', '23000', '27000'],
        y: [0, 1, 1],
        type: 'bar',
        marker: {
          color: ['#0070C0', '#0070C0', '#0070C0']
        }
      }
    ];

    const layout = {
      title: 'Histogram of field size',
      bargap: 0.5,
      hovermode: 'closest'
    };

    Plotly.newPlot('histogram',
      data,
      layout,
      {
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines'],
        displaylogo: false
      }
    );
  }
}

