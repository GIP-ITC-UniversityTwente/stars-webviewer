import { Component, OnInit } from '@angular/core';

declare let Plotly: any;
declare let geostats: any;

@Component({
  selector: 'app-field-characteristic-section',
  templateUrl: './field-characteristic-section.component.html',
  styleUrls: ['./field-characteristic-section.component.css']
})
export class FieldCharacteristicSectionComponent implements OnInit {

  /**
   * Properties
   */
  selectedFieldCharacteristic: string;
  fieldCharacteristics: string[] = ["Field Size"];
  selectedClassificationMethod: string;
  classificationMethods: string[];
  selectedClassSize: number;
  classSizes: number[] = [1, 2, 3, 4, 5];
  frequencyData: number[];
  geostatSeries: any;

  /**
   * Component Life-cycle methods
   */
  constructor() { }

  ngOnInit() {

    this.createTestHistogram();
  }

  /**
   * For handling when a user taps the info button for field characteristics.
   */
  handleInfoButtonTap() {
    console.log('show info for field characteristics')
  }

  /**
   * For handling when a user changes the target field characteristic.
   */
  onFieldCharacteristicChange() {

    // TODO - call Field Characteristics API when it is ready

    // simulates a call to the STARS API
    this.frequencyData = [10.1, 10.1, 12.1, 12.1, 13.3, 13.3, 13.3, 14.4, 14.4, 14.4, 14.4, 15.5, 15.5, 15.5, 15.5, 15.5, 15.5, 16.6, 16.6, 16.6, 16.6, 17.7, 17.7, 17.7, 18.8, 18.8, 18.8, 18.8, 19.9, 19.9, 19.9, 20.1, 20.1];

    // create histogram
    this.geostatSeries = new geostats(this.frequencyData);
    let histoData = this.createUnclassifiedHistogramDataObject(this.frequencyData);
    this.createHistogram(histoData, false);
  }

  /**
   * For handling when a user changes the number of classes when viewing the frequency data.
   */
  onClassSizeChange() {
    // Provide user classification methods.
    this.classificationMethods = ["Jenks", "Equal Interval", "Quantile", "Unique Values", "Standard Deviation", "Arithmetic Progression", "Geometric Progression"];
  }

  /**
   * For handling when a user changes the target classification when viewing the frequency data.
   */
  onClassificationChange() {

    if (this.selectedClassificationMethod == "Jenks") {
      this.geostatSeries.getJenks(this.selectedClassSize);
    }
    else if (this.selectedClassificationMethod == "Equal Interval") {
      this.geostatSeries.getClassEqInterval(this.selectedClassSize);
    }
    else if (this.selectedClassificationMethod == "Quantile") {
      this.geostatSeries.getClassQuantile(this.selectedClassSize);
    }
    else if (this.selectedClassificationMethod == "Unique Values") {
      this.geostatSeries.getClassUniqueValues(this.selectedClassSize);
    }
    else if (this.selectedClassificationMethod == "Standard Deviation") {
      this.geostatSeries.getClassStdDeviation(this.selectedClassSize);
    }
    else if (this.selectedClassificationMethod == "Arithmetic Progression") {
      this.geostatSeries.getClassArithmeticProgression(this.selectedClassSize);
    }
    else if (this.selectedClassificationMethod == "Geometric Progression") {
      this.geostatSeries.getClassGeometricProgression(this.selectedClassSize);
    }

    // create histogram
    let histoData = this.createClassifiedHistogramDataObject(this.frequencyData);
    this.createHistogram(histoData, true);
    //
    console.log('the raw freq data: ' + this.frequencyData);
  }

  /**
   * Utility for creating a histogram for the input series
   * @param histogramData
   */
  createHistogram(histogramData: any, isShowing: boolean) {

    let layout = {
      title: 'Histogram',
      bargap :0.5,
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

    let result = [];
    const lastValue = series[series.length-1];
    series.forEach((item) => {
      if (item >= start && item < end) {
        result.push(item);
      }
      else if (item == end && end == lastValue) {
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

     let result = [];

     // get unique values
     let uniqueValues = new Set(values);

     // get count of unique values
     uniqueValues.forEach(function(currentUniqueValue) {
       let count = 0;
       values.forEach(function(item) {
         if (item == currentUniqueValue) {
           count += 1;
         }
       });
       result.push(count);
     });

     return result
  }

  /**
   * Utility for fetching a histogram color.
   * @param {number} index
   */
  static fetchHistogramColorForIndex(index: number) {
    if (index == 0) {
      return '#A1D99B';
    }
    else if (index == 1) {
      return '#74C476';
    }
    else if (index == 2) {
      return '#41AB5D';
    }
    else if (index == 3) {
      return '#238B45';
    }
    else if (index == 4) {
      return '005A32';
    }
  }

  /**
   * Utility for creating the data object for a classified histogram
   * @param {number[]} series
   */
  createClassifiedHistogramDataObject(series: number[]) {

    const sorted = series.sort((n1,n2) => n1 - n2);

    let result = [];
    if (this.selectedClassSize > 0) {
      this.geostatSeries.ranges.forEach(function(item, index){

        // get the start and end values for the current range
        let sliced = item.split(" - ");
        const startRange = sliced[0];
        const endRange = sliced[1];
        //
        console.log('the range is: ' + startRange + ' to ' + endRange);

        // get the values in the series for the current range
        const values = FieldCharacteristicSectionComponent.fetchValuesInRange(sorted, startRange, endRange);
        //
        console.log('the values are: ' + values);

        // get the count for each value
        let counts = FieldCharacteristicSectionComponent.fetchCountOfValues(values);
        //
        console.log('the counts are: ' + counts);

        // create color array (per Plotly spec)
        const color = FieldCharacteristicSectionComponent.fetchHistogramColorForIndex(index);
        let colorArray = [];
        values.forEach(function(){
          colorArray.push(color);
        });

        // create a frequency data item (per Plotly spec)
        let freqItem = {
          'name': 'Class ' + index + ' (' + startRange + '-' + endRange + ')',
          'x': values,
          'y': counts,
          type: 'bar',
          marker: { color:  colorArray}
        };

        result.push(freqItem);
      });

      //
      console.log('the histogram model');
      console.log(result);
    }

    return result;
  }

  /**
   * Utility for creating the data object for an un-classified histogram
   * @param {number[]} series
   */
  createUnclassifiedHistogramDataObject(series: number[]) {

    let result = [];

    // get unique values
    let uniqueValues = new Set(series);

    // get count of unique values
    uniqueValues.forEach(function(currentUniqueValue) {
      let freqItem = {
        'name': currentUniqueValue,
        'x': [currentUniqueValue],
        'y': [0],
        type: 'bar',
        marker: { color: ['#CDCDCD'] }
      };
      series.forEach(function(item) {
        if (item == currentUniqueValue) {
          let count = freqItem['y'][0];
          count += 1;
          freqItem['y'][0] = count;
        }
      });
      result.push(freqItem);
    });

    return result;
  }

  /**
   * Creates a test histogram to demonstrate the general code required for the chart.
   */
  createTestHistogram() {
    // field based characteristic sample classification data
    let data = [
      {
        name: 'Medium Field',
        x: ['7000'],
        y: [2],
        type: 'bar',
        marker:{
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

    let layout = {
      title: 'Histogram field size & classification',
      bargap :0.5,
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
