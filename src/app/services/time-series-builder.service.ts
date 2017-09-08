import { Injectable } from '@angular/core';

@Injectable()
export class TimeSeriesBuilderService {

  // standardizes the characteristic types a user can choose in the time series section
  static fetchCharacteristicTypes(): string[] {
    return ['Image Characteristic', 'Field Characteristic'];
  }

  // standardizes the image types a user can choose in the time series section
  static fetchImageTypes(): string[] {
    return ['Spectral', 'Textural'];
  }

  // Utility for creating a comma-delimited list of Crops from the input array
  static createCropList(crops: string[]): string {
    let cropList = '';
    crops.forEach(function(item, index) {
      if (index === crops.length - 1) {
        cropList += crops[index];
      } else {
        cropList += crops[index] + ',';
      }
    });
    return cropList;
  }

  /**
   * Utility for creating a unique set of image characteristic names.
   * @param {any[]} imageCharacteristics
   * @returns {string[]}
   */
  static createUniqueCharacteristicNames(imageCharacteristics: any[]): string[] {
    const uniqueCharacteristicNames = new Set();
    imageCharacteristics.forEach(function(item) {
      uniqueCharacteristicNames.add(item.alias);
    });
    return Array.from(uniqueCharacteristicNames);
  }

  /**
   * Utility for fetching the image characteristic id associated with the input image characteristic name.
   * @param imageCharacteristicAlias
   * @param allImageCharacteristics
   * @returns {number}
   */
  static fetchImageCharacteristicId(imageCharacteristicAlias: string, allImageCharacteristics: any[]): number {
    let targetId: number = undefined;
    allImageCharacteristics.forEach(function(item){
      if (item.alias === imageCharacteristicAlias) {
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
  static fetchSensorsForImageCharacteristic(imageCharacteristicAlias: string, allImageCharacteristics: any[]): string[] {
    const results: string[] = [];
    allImageCharacteristics.forEach(function(item) {
      if (item.alias === imageCharacteristicAlias) {
        results.push(item.sensor);
      }
    });
    return results;
  }
  /**
   * Fetches parameter 1 and/or parameter 2 if exists for the input image type, image characteristic, and sensor from the API response
   * @param {string} imageType
   * @param {string} imageCharacteristicName
   * @param {string} sensor
   * @param {any[]} allSpectralCharacteristics
   * @param {any[]} allTexturalCharacteristics
   */
  static fetchParametersForImageCharacteristic(imageType: string, imageCharacteristicName: string, sensor: string, allSpectralCharacteristics: any[], allTexturalCharacteristics: any[]) {

    const result = [];

    if (imageType === 'Spectral') {
      allSpectralCharacteristics.forEach(function(item) {
        if (item.alias === imageCharacteristicName && item.sensor === sensor) {
          if (item.hasOwnProperty('parameter1')) {
            result.push(item.parameter1);
          }
          if (item.hasOwnProperty('parameter2')) {
            result.push(item.parameter2);
          }
        }
      });
    } else if (imageType === 'Textural') {
      allTexturalCharacteristics.forEach(function(item) {
        if (item.alias === imageCharacteristicName && item.sensor === sensor) {
          if (item.hasOwnProperty('parameter1')) {
            result.push(item.parameter1);
          }
          if (item.hasOwnProperty('parameter2')) {
            result.push(item.parameter2);
          }
        }
      });
    }

    return result;
  }
  /**
   * The API provides a string literal for a parameter - such as (e.g. 'bandNumber : 1..4') - this fetches the parameter name
   * @param {string} apiParameterValue
   * @returns {string}
   */
  static fetchParameterName(apiParameterValue: string) {
    const substrings = apiParameterValue.split(' ');
    return substrings[0];
  }

  /**
   * The API provides a string literal for a parameter - such as (e.g. 'bandNumber : 1..4') - this fetches the range of values for the parameter anem
   * @param {string} apiParameterValue
   * @returns {string}
   */
  static fetchParameterRange(apiParameterValue: string) {
    const range = [];
    const substrings = apiParameterValue.split(' ');
    const rangeAsString = substrings[2];
    const valueSubstrings = rangeAsString.split('..');
    const lower = Number(valueSubstrings[0]);
    const upper = Number(valueSubstrings[1]);
    for (let i = lower; i <= upper; i++) {
      range.push(i);
    }

    return range;
  }

  /**
   * Utility for fetching a random color from color palette when drawing lines for the time series chart
   * @returns {string}
   */
  static fetchTimeSeriesLineColor(): string {
    const colors = ['#6A7f00', '#D26F51', '#D59F2E', '#00577F', '#C548C0'];
    const randomIndex = TimeSeriesBuilderService.randomIntFromInterval(0, (colors.length - 1));
    return colors[randomIndex];
  }

  /**
   * Utility for fetching a random number between the input min and max values
   * @param min
   * @param max
   * @returns {number}
   */
  static randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Utility for fetching a complimentary background color for the time series envelope.
   * @param lineColor
   * @returns {string}
   */
  static fetchTimeSeriesEnvelopeColor(lineColor): string {

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
   * Utility for creating an image characteristics time series data object (per Plotly's spec) for creating a time series from the STARS API web response.
   * @param apiResponse
   * @returns {Array}
   */
  static createImageCharacteristicTimeSeriesData(apiResponse: any) {

    const chartData = [];

    for (const item of apiResponse.results) {
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
      }
    }

    return chartData;
  }

  static createFieldCharacteristicTimeSeriesData(apiResponse: any) {

    const chartData = [];

    for (const item of apiResponse.results) {
      const cropName = item.crop;
      const dateCollection = [];
      const avgValueCollection = [];
      const maxValueCollection = [];
      const minValueCollection = [];

      for (const crop of item.cseries[0]) {   // note variation - need to do [0]
        dateCollection.push(crop.acquisition_date);
        avgValueCollection.push(crop.avgvalue);
        if (crop.hasOwnProperty('maxvalue') && crop.hasOwnProperty('minvalue')) {
          if (crop.maxvalue != null) {
            maxValueCollection.push(crop.maxvalue);
          }
          if (crop.minvalue != null) {
            minValueCollection.push(crop.minvalue);
          }
        }
      }

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

    return chartData;
  }

  /**
   * Utility for creating an image characteristics time series layout object.
   * @param {string} chartTitle
   * @param {string} yAxisTitle
   * @returns {}
   */
  static createTimeSeriesLayout(chartTitle: string, yAxisTitle: string) {
    return  {
      title: chartTitle + ' Time Series',
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
  }

  /**
   * Utility for creating an empty chart
   * @param Plotly
   * @param targetChartDivId
   */
  static createEmptyTimeSeriesChart(Plotly: any, targetChartDivId: string) {

    const texturalLine = {
      x: [],
      y: [],
      mode: 'lines',
      name: '',
      line: {
        color: '#2673A8',
        width: 3
      }
    };

    // layout for millet textural test sample
    const texturalLayout = {
      title: 'Time Series',
      xaxis: {
        title: 'Time',
        showgrid: true,
        zeroline: true,
        ticks: 'outside',
        showticklabels: true
      },
      yaxis: {
        title: '',
        showline: false
      },
      hovermode: 'closest'
    };

    Plotly.newPlot(targetChartDivId,
      [texturalLine],
      texturalLayout,
      {
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines'],
        displaylogo: false
      }
    );
  }

  /**
   * Utility for testing patterns for creating chart spec.
   */
  static createDefaultTimeSeriesCharts(Plotly: any) {

    // ----------------------
    //  CHART 1 PLACEHOLDER
    // ----------------------

    const milletSpectralLineEnvelope = {"x":["2014-05-01","2014-06-24","2014-07-08","2014-08-07","2014-09-22","2014-09-25","2014-09-25","2014-09-22","2014-08-07","2014-07-08","2014-06-24","2014-05-01"],"y":[0.086905,0.157471,0.231943,0.406578,0.579189,0.522719,0.674395,0.753523,0.553946,0.361415,0.253017,0.189081],"fill":"tozerox","fillcolor":"rgba(0, 87, 127, 0.2)","name":"","showlegend":false,"type":"scatter","line":{"color":"transparent"}};

    // data for millet spectral test sample
    const milletSpectralLine = {"x":["2014-05-01","2014-06-24","2014-07-08","2014-08-07","2014-09-22","2014-09-25","2014-09-25","2014-09-22","2014-08-07","2014-07-08","2014-06-24","2014-05-01"],"y":[0.137993,0.205244,0.296679,0.480262,0.666356,0.598557],"mode":"lines","name":"Groundnut","line":{"color":"#00577F","width":3},"type":"scatter"};

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

    TimeSeriesBuilderService.createEmptyTimeSeriesChart(Plotly, 'chart2');
  }

  /**
   * Service life-cycle methods
   */
  constructor() { }
}
