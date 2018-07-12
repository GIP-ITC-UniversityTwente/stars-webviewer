import { Injectable } from '@angular/core';
declare const chroma: any;
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
   * Utility for fetching the image characteristic unit associated with the input image characteristic name.
   * @param imageCharacteristicAlias
   * @param allImageCharacteristics
   * @returns {number}
   */
  static fetchImageCharacteristicUnit(imageCharacteristicAlias: string, allImageCharacteristics: any[]): string {
    let targetUnit: string = undefined;
    allImageCharacteristics.forEach(function(item){
      if (item.alias === imageCharacteristicAlias) {
          targetUnit = item.unit;
      }
    });
    return targetUnit;
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
  static fetchTimeSeriesLineColor(crop:string='none',className:string='none',numberClasses:number=10): string {
      const orange='#ff9933';
      const orangeLst=chroma.scale(['#ffe6cc','#ff9933','#4d2600']).colors(numberClasses);
      const blue='#000099';
      const blueLst=chroma.scale(['#ccccff','#000099','#000033']).colors(numberClasses);
      //blueLst=['#e6e6ff','#9999ff','#4d4dff','#0000ff','#0000cc','#000099','#00004d'];
      const red='#ff0000';
      const redLst=chroma.scale(['#ffe6e6','#ff0000','#330000']).colors(numberClasses);
      //const redLst=['#ffe6e6','#ffb3b3','#ff6666','#ff0000','#b30000','#660000','#330000'];
      const green='#339933';
      const greenLst=chroma.scale(['#ccffdd','#339933','#003311']).colors(numberClasses);
      //const greenLst=['#ecf9ec','#b3e6b3','#79d279','#40bf40','#339933','#206020','#133913'];
      const brown='#996633';
      const brownLst=chroma.scale(['#f2e6d9','#996633','#261a0d']).colors(numberClasses);
      //const brownLst=['#f9f2ec','#e6ccb3','#d2a679','#bf8040','#996633','#604020','#261a0d'];
      const grey='#808080';
      const greyLst=chroma.scale(['white','#808080','black']).colors(numberClasses);
      //const greyLst=['#f2f2f2','#cccccc','#a6a6a6','#808080','#595959','#404040','#262626'];
      const purple='#cc00cc';
      const purpleLst=chroma.scale(['#ffccff','#cc00cc','#330033']).colors(numberClasses);
      //const purpleLst=['#ffe6ff','#ff99ff','#ff4dff','#ff00ff','#cc00cc','#990099','#4d004d'];
      
      
      if(crop=='none'||crop.toLowerCase()=='cotton'){
          if(className!='none'&& isNaN(Number(className.split(" ")[1]))!=true){
              const classNumber=Number(className.split(" ")[1]);
              return orangeLst[classNumber-1];
          }else{
              return orange;
          }
      }else if(crop.toLowerCase()=='groundnut'){
          if(className!='none'&& isNaN(Number(className.split(" ")[1]))!=true){
              const classNumber=Number(className.split(" ")[1]);
              return blueLst[classNumber-1];
          }else{
              return blue;
          }
      }
      else if(crop.toLowerCase()=='maize'){
          if(className!='none'&& isNaN(Number(className.split(" ")[1]))!=true){
              const classNumber=Number(className.split(" ")[1]);
              return redLst[classNumber-1];
          }else{
              return red;
          }
      }
      else if(crop.toLowerCase()=='millet'){
          if(className!='none'&& isNaN(Number(className.split(" ")[1]))!=true){
              const classNumber=Number(className.split(" ")[1]);
              return greenLst[classNumber-1];
          }else{
              return green;
          }
      }
      else if(crop.toLowerCase()=='other'){
          if(className!='none'&& isNaN(Number(className.split(" ")[1]))!=true){
              const classNumber=Number(className.split(" ")[1]);
              return brownLst[classNumber-1];
          }else{
              return brown;
          }
      }
      else if(crop.toLowerCase()=='sorghum'){
          if(className!='none'&& isNaN(Number(className.split(" ")[1]))!=true){
              const classNumber=Number(className.split(" ")[1]);
              return greyLst[classNumber-1];
          }else{
              return grey;
          }
      }
      else if(crop.toLowerCase()=='uncultivated'){
          if(className!='none'&& isNaN(Number(className.split(" ")[1]))!=true){
              const classNumber=Number(className.split(" ")[1]);
              return purpleLst[classNumber-1];
          }else{
              return purple;
          }
      }
      
//    const colors = ['#6A7f00', '#D26F51', '#D59F2E', '#00577F', '#C548C0'];
//    const randomIndex = TimeSeriesBuilderService.randomIntFromInterval(0, (colors.length - 1));
//    return colors[randomIndex];
  }
  
//  /**
//   * Utility for fetching a random color from color palette when drawing lines for the time series chart
//   * @returns {string}
//   */
//  static fetchTimeSeriesLineColor(): string {
//    const colors = ['#6A7f00', '#D26F51', '#D59F2E', '#00577F', '#C548C0'];
//    const randomIndex = TimeSeriesBuilderService.randomIntFromInterval(0, (colors.length - 1));
//    return colors[randomIndex];
//  }

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
   * Utility to transform Hex into rgba qith transparency. Adapted from https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
   * @param hex
   * @param transp
   * @returns {string}
   */
  static hexToRgbA(hex: string, transp: string): string {
      let c;
      if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
          c= hex.substring(1).split('');
          if(c.length== 3){
              c= [c[0], c[0], c[1], c[1], c[2], c[2]];
          }
          c= '0x'+c.join('');
          return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+transp+')';
      }
      throw new Error('Bad Hex: '+hex);
  }

  /**
   * Utility for fetching a complimentary background color for the time series envelope.
   * @param lineColor
   * @returns {string}
   */
  static fetchTimeSeriesEnvelopeColor(lineColor): string {
    return this.hexToRgbA(lineColor,'0.2');
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
        const lineColor = TimeSeriesBuilderService.fetchTimeSeriesLineColor(cropName);
        const lineDataObject = {
          x: dateCollection,
          y: avgValueCollection,
          legendgroup: cropName,
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
          fill: 'toself',
          legendgroup: cropName,
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
  
  /**
   * Utility for creating a classified image characteristics time series data object (per Plotly's spec) for creating a time series from the STARS API web response.
   * @param apiResponse
   * @returns {Array}
   */
  static createImageClassifiedTimeSeriesData(apiResponse: any,classesList:any='none') {
    let numberClasses=classesList.split(",").filter(e => e !== 'Bin 0').length;
    const chartData = [];

    for (const item of apiResponse.results) {
      const cropName = item.crop;
      const className = item.cls;
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
        const lineColor = TimeSeriesBuilderService.fetchTimeSeriesLineColor(cropName,className,Number(numberClasses));
        const lineDataObject = {
          x: dateCollection,
          y: avgValueCollection,
          mode: 'lines',
          legendgroup: className+' ('+cropName+')',
          name: className+' ('+cropName+')',
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
          legendgroup: className+' ('+cropName+')',
          fill: 'toself',
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
    //console.log(chartData);
    return chartData;
  }

  static createFieldCharacteristicTimeSeriesData(apiResponse: any) {
//    console.log(apiResponse);
    const chartData = [];
    for (const item of apiResponse.results) {
      const cropName = item.crop;
      const dateCollection = [];
      const avgValueCollection = [];
      const maxValueCollection = [];
      
      const dateCollectionMultiarray = [];
      let dateCollectionMultiarrayTemp = [];
      let maxValueCollectionTemp = [];
      const minValueCollection = [];
      let minValueCollectionTemp = [];

      for (const crop of item.cseries[0]) {   // note variation - need to do [0]
          
        dateCollection.push(crop.acquisition_date);
        avgValueCollection.push(crop.avgvalue);
        
        dateCollectionMultiarrayTemp.push(crop.acquisition_date);
        
        if (crop.hasOwnProperty('maxvalue') && crop.hasOwnProperty('minvalue')) {
          if (crop.maxvalue != null) {
              maxValueCollectionTemp.push(crop.maxvalue);
          }
          if (crop.minvalue != null) {
              minValueCollectionTemp.push(crop.minvalue);
          }
        }
        
        if(crop.seasonedge=='end'){
            let null_date = new Date(crop.acquisition_date);
            // Add a day
            null_date.setDate(null_date.getDate() + 1);
            dateCollection.push(null_date.toISOString().split('T')[0]);
            dateCollectionMultiarray.push(dateCollectionMultiarrayTemp);
            dateCollectionMultiarrayTemp=[];
            avgValueCollection.push(null);
            maxValueCollection.push(maxValueCollectionTemp);
            maxValueCollectionTemp=[];
            
            minValueCollection.push(minValueCollectionTemp);
            minValueCollectionTemp=[];
        }

      }
//      console.log(minValueCollection);
//      console.log(maxValueCollection);
//      console.log(dateCollectionMultiarray);
//      console.log(avgValueCollection);
      
      // draw line and envelope
      if (maxValueCollection.length!=0 && dateCollectionMultiarray.length===maxValueCollection.length) {

        // chart's line
        const lineColor = TimeSeriesBuilderService.fetchTimeSeriesLineColor(cropName);
        const lineDataObject = {
          x: dateCollection,
          y: avgValueCollection,
          mode: 'lines',
          legendgroup: cropName,
          name: cropName,
          line: {
            color: lineColor,
            width: 3
          },
          type: 'scatter'
        };
        chartData.push(lineDataObject);
        
        
        ////////////Deal with breaks ////////////////////////
        for (let i=0; i<dateCollectionMultiarray.length;i++) {
            // chart's envelope
            const envelopeY = minValueCollection[i];
            for (let ii = maxValueCollection[i].length - 1; ii >= 0; ii--) {
              envelopeY.push(maxValueCollection[i][ii]);
            }
    
            const envelopeX = dateCollectionMultiarray[i];
            for (let jj = dateCollectionMultiarray[i].length - 1; jj >= 0; jj--) {
              envelopeX.push(dateCollectionMultiarray[i][jj]);
            }
            const backgroundColor = TimeSeriesBuilderService.fetchTimeSeriesEnvelopeColor(lineColor);
            const envelopeDataObject = {
              x: envelopeX,
              y: envelopeY,
              fill: 'toself',
              connectgaps:false, 
              fillcolor: backgroundColor,
              legendgroup: cropName,
              name: '',
              showlegend: false,
              type: 'scatter',
              line: {color: 'transparent'}
            };
    
            // add line & envelope to chart data
            chartData.push(envelopeDataObject);
         }
        
        ///////////////////////////////////////////////////
        
      } else {

        // only draw line ...
          
        // chart's line
        const lineColor = TimeSeriesBuilderService.fetchTimeSeriesLineColor(cropName);
        const lineDataObject = {
          x: dateCollection,
          y: avgValueCollection,
          mode: 'lines',
          legendgroup: cropName,
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
//    console.log(chartData);
    return chartData;
  }
  
  static createFieldClassifiedTimeSeriesData(apiResponse: any,classesList:any='none') {
      let numberClasses=classesList.split(",").filter(e => e !== 'Bin 0').length;

      const chartData = [];
      for (const item of apiResponse.results) {
        const cropName = item.crop;
        const className = item.class;
        const dateCollection = [];
        const avgValueCollection = [];
        const maxValueCollection = [];
        const minValueCollection = [];
        
        const dateCollectionMultiarray = [];
        let dateCollectionMultiarrayTemp = [];
        let maxValueCollectionTemp = [];
        let minValueCollectionTemp = [];

        for (const crop of item.cseries[0]) {   // note variation - need to do [0]
            
          dateCollection.push(crop.acquisition_date);
          avgValueCollection.push(crop.avgvalue);
          
          dateCollectionMultiarrayTemp.push(crop.acquisition_date);
          
          if (crop.hasOwnProperty('maxvalue') && crop.hasOwnProperty('minvalue')) {
            if (crop.maxvalue != null) {
                maxValueCollectionTemp.push(crop.maxvalue);
            }
            if (crop.minvalue != null) {
                minValueCollectionTemp.push(crop.minvalue);
            }
          }
          
          if(crop.seasonedge=='end'){
              let null_date = new Date(crop.acquisition_date);
              // Add a day
              null_date.setDate(null_date.getDate() + 1);
              dateCollection.push(null_date.toISOString().split('T')[0]);
              dateCollectionMultiarray.push(dateCollectionMultiarrayTemp);
              dateCollectionMultiarrayTemp=[];
              avgValueCollection.push(null);
              maxValueCollection.push(maxValueCollectionTemp);
              maxValueCollectionTemp=[];
              
              minValueCollection.push(minValueCollectionTemp);
              minValueCollectionTemp=[];
          }

        }

        // draw line and envelope
        if (maxValueCollection.length!=0 && dateCollectionMultiarray.length===maxValueCollection.length) {
            // chart's line
            const lineColor = TimeSeriesBuilderService.fetchTimeSeriesLineColor(cropName,className,Number(numberClasses));
            const lineDataObject = {
              x: dateCollection,
              y: avgValueCollection,
              mode: 'lines',
              legendgroup: className+' ('+cropName+')',
              name: className+' ('+cropName+')',
              line: {
                color: lineColor,
                width: 3
              },
              type: 'scatter'
            };
            chartData.push(lineDataObject);
            
            
            ////////////Deal with breaks ////////////////////////
            for (let i=0; i<dateCollectionMultiarray.length;i++) {
                // chart's envelope
                const envelopeY = minValueCollection[i];
                for (let ii = maxValueCollection[i].length - 1; ii >= 0; ii--) {
                  envelopeY.push(maxValueCollection[i][ii]);
                }
        
                const envelopeX = dateCollectionMultiarray[i];
                for (let jj = dateCollectionMultiarray[i].length - 1; jj >= 0; jj--) {
                  envelopeX.push(dateCollectionMultiarray[i][jj]);
                }
                const backgroundColor = TimeSeriesBuilderService.fetchTimeSeriesEnvelopeColor(lineColor);
                const envelopeDataObject = {
                  x: envelopeX,
                  y: envelopeY,
                  fill: 'toself',
                  legendgroup: className+' ('+cropName+')',
                  connectgaps:false, 
                  fillcolor: backgroundColor,
                  name: '',
                  showlegend: false,
                  type: 'scatter',
                  line: {color: 'transparent'}
                };
        
                // add line & envelope to chart data
                chartData.push(envelopeDataObject);
             }
            ///////////////////////////////////////////////////
            
          } else {

          // only draw line ...

          // chart's line
          const lineColor = TimeSeriesBuilderService.fetchTimeSeriesLineColor(cropName,className,Number(numberClasses));
          const lineDataObject = {
            x: dateCollection,
            y: avgValueCollection,
            legendgroup: className+' ('+cropName+')',
            mode: 'lines',
            name: className+' ('+cropName+')',
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
     * Utility for capitalize the first letter.
     * @param {string} string
     * @returns {string} 
     */
    static capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
  /**
   * Utility for creating an image characteristics time series layout object.
   * @param {string} chartTitle
   * @param {string} yAxisTitle
   * @returns {}
   */
  static createTimeSeriesLayout(chartTitle: string, yAxisTitle: string,unit:string='') {
      if(unit=='none'){
          unit='';
      }
      if(unit!=''){
          unit='<br>(unit: '+unit+')';
      }
    return  {
      title: this.capitalizeFirstLetter(chartTitle) + ' time series'+unit,
      legend:{
          traceorder:"normal",
      },
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
        rangemode:"nonnegative",
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
        rangemode:"nonnegative",
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
  static createDefaultTimeSeriesCharts(Plotly: any, targetChartDivId: string='chart1') {
    // ----------------------
    //  CHART 1 PLACEHOLDER
    // ----------------------

    const milletSpectralLineEnvelope = {
            "x":["2014-05-01","2014-06-24","2014-07-01","2014-07-08","2014-08-07","2014-09-22","2014-09-25","2014-09-25","2014-09-22","2014-08-07","2014-07-08","2014-07-01","2014-06-24","2014-05-01"],
            "y":[0.086905,0.157471,null,0.231943,0.406578,0.579189,0.522719,0.674395,0.753523,0.553946,0.361415,null,0.253017,0.189081],
            "fill":"toself",
            connectgaps: true,
            legendgroup: 'a',
            "fillcolor":"rgba(0, 87, 127, 0.2)",
            "name":"",
            "showlegend":false,
            "type":"scatter",
            "line":{"color":"transparent"}
          };
    const milletSpectralLineEnvelope1 = {
            "x":["2014-07-08","2014-08-07","2014-09-22","2014-09-25","2014-09-25","2014-09-22","2014-08-07","2014-07-08"],
            "y":[0.231943,0.406578,0.579189,0.522719,0.674395,0.753523,0.553946,0.361415],
            "fill":"toself",
            connectgaps: true,
            legendgroup: 'a',
            "fillcolor":"rgba(0, 87, 127, 0.2)",
            "name":"",
            "showlegend":false,
            "type":"scatter",
            "line":{"color":"transparent"}
          };
    const milletSpectralLineEnvelope2 = {
            "x":["2014-05-01","2014-06-24","2014-06-24","2014-05-01"],
            "y":[0.086905,0.157471,0.253017,0.189081],
            "fill":"toself",
            connectgaps: true,
            legendgroup: 'a',
            "fillcolor":"rgba(0, 87, 127, 0.2)",
            "name":"",
            "showlegend":false,
            "type":"scatter",
            "line":{"color":"transparent"}
          };

    // data for millet spectral test sample
    const milletSpectralLine = {
            "x":["2014-05-01","2014-06-24","2014-07-01","2014-07-08","2014-08-07","2014-09-22","2014-09-25"],
            "y":[0.137993,0.205244,null,0.296679,0.480262,0.666356,0.598557],
            "mode":"lines",
            legendgroup: 'a',
            "name":"Groundnut",
            "line":{"color":"#00577F","width":3},
            "type":"scatter"
          };

    // layout for millet spectral test sample
    const milletSpectralLayout = {
      title: 'Time Series',
      xaxis: {
        title: 'Time',
        showgrid: true,
        zeroline: true,
        ticks: 'outside',
        showticklabels: true
      },
      yaxis: {
        title: 'NDVI average',
        rangemode:"nonnegative",
        showline: false,
        ticks: 'outside',
        showticklabels: true
      },
      hovermode: 'closest'
    };

    // spectral chart for millet
    const milletSpectralData = [];//[milletSpectralLineEnvelope1,milletSpectralLineEnvelope2, milletSpectralLine];
    Plotly.newPlot(targetChartDivId,
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
