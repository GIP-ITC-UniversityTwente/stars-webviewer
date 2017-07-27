import { Injectable } from '@angular/core';

@Injectable()
export class HistogramBuilderService {

  // This standardizes the classification methods available to the application when calling methods from the geostats library
  static classificationMethods = ['Jenks', 'Equal Interval', 'Quantile', 'Unique Values', 'Standard Deviation', 'Arithmetic Progression', 'Geometric Progression'];

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
      return '#005A32';
    }
  }

  /**
   * Utilitly for classifiying the frequency data using geostats.
   * @param {string} targetClassification
   * @param {number} classSize
   * @param geostatSeries
   */
  static classifySeries(targetClassification: string, classSize: number, geostatSeries: any) {
    if (targetClassification === HistogramBuilderService.classificationMethods[0]) {
      geostatSeries.getJenks(classSize);
    } else if (targetClassification === HistogramBuilderService.classificationMethods[1]) {
      geostatSeries.getClassEqInterval(classSize);
    } else if (targetClassification === HistogramBuilderService.classificationMethods[2]) {
      geostatSeries.getClassQuantile(classSize);
    } else if (targetClassification === HistogramBuilderService.classificationMethods[3]) {
      geostatSeries.getClassUniqueValues(classSize);
    } else if (targetClassification === HistogramBuilderService.classificationMethods[4]) {
      geostatSeries.getClassStdDeviation(classSize);
    } else if (targetClassification === HistogramBuilderService.classificationMethods[5]) {
      geostatSeries.getClassArithmeticProgression(classSize);
    } else if (targetClassification === HistogramBuilderService.classificationMethods[6]) {
      geostatSeries.getClassGeometricProgression(classSize);
    } else {
      geostatSeries.getJenks(classSize);
    }
  }

  /**
   * Utility for creating the data object for a classified histogram.
   * @param {number[]} series - the frequency data
   * @param ranges
   * @returns {Array}
   */
  static createClassifiedHistogramDataObject(series: number[], ranges: string[]) {
    const result = [];
    ranges.forEach(function(item, index) {

      // get the start and end values for the current range
      const sliced = item.split(' - ');
      const startRange = Number(sliced[0]);
      const endRange = Number(sliced[1]);

      // get the values in the series for the current range
      const values = HistogramBuilderService.fetchValuesInRange(series, startRange, endRange);

      // create color array (per Plotly spec)
      const targetColor = HistogramBuilderService.fetchHistogramColorForIndex(index);
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
    console.log(JSON.stringify(result));

    return result;
  }

  /**
   * Utility for creating the data object for an un-classified histogram.
   * @param {number[]} series
   */
  static createUnclassifiedHistogramDataObject(series: number[]) {

    // build histogram data object per the Plotly spec
    return [{
      x: series,
      type: 'histogram'
    }];
  }

  /**
   * Utility for creating a test histogram to demonstrate the general code required for the chart.
   * @param plotly
   */
  static createTestHistogram(plotly: any) {

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

    plotly.newPlot('histogram',
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
