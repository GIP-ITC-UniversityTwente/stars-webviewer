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
   * Utility for testing patterns for creating chart spec.
   */
  static createTestCharts(Plotly: any) {

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

  /**
   * Service life-cycle methods
   */
  constructor() { }
}
