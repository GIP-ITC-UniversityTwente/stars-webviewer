import { Injectable } from '@angular/core';
declare const chroma: any;
@Injectable()
export class HistogramBuilderService {

  // This standardizes the classification methods available to the application when calling methods from the geostats library
  static classificationMethods = ['Default (plotly based)','Jenks', 'Equal Interval', 'Quantile', 'Standard Deviation', 'Arithmetic Progression', 'Geometric Progression'];

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
      if (start < end) {
        if (item >= start && item < end) {
          result.push(item);
        } else if (item === end && end === lastValue) {
          result.push(item);
        }
      } else {
        if (item >= end && item < start) {
          result.push(item);
        } else if (item === start && start === lastValue) {
          result.push(item);
        }
      }

    });

    return result;
  }

  /**
   * Utility for fetching a histogram color.
   * @param {number} index
   */
  static fetchHistogramColorForIndex(index: number,classesNumber:number=10) {
     const colors= chroma.scale(['#d6f5d6','#33cc33','#0a290a']).colors(classesNumber);
     if(index<=20){
         return colors[index-1];
     }else{
         return chroma.random();
     }
  }
  /**
   * Utility for fetching a histogram color.
   * @param {number} index
   */
  static classifyAutomaticBins(binStart: number,binEnd: number,binSize: number) {
      let currentEnd = binStart;
      let currentStart = binStart;
      let range=[];
      while (currentEnd < binEnd) {
          currentEnd += binSize;
          currentStart = currentEnd - binSize;
          range.push(currentStart+" - "+currentEnd);
//          console.log('currentStart is: ', currentStart, ' currentEnd is: ', currentEnd);
      }
      return range
  }

  /**
   * Utility for classifiying the frequency data using geostats.
   * @param {string} targetClassification
   * @param {number} classSize
   * @param geostatSeries
   */
  static classifySeries(targetClassification: string, classSize: number, geostatSeries: any) {
      if(targetClassification === HistogramBuilderService.classificationMethods[0]){
          console.log('Default classification selected, not manual!');
          return null
      } 
      else if (targetClassification === HistogramBuilderService.classificationMethods[1]) {
      geostatSeries.getJenks(classSize);
    } else if (targetClassification === HistogramBuilderService.classificationMethods[2]) {
      geostatSeries.getClassEqInterval(classSize);
    } else if (targetClassification === HistogramBuilderService.classificationMethods[3]) {
      geostatSeries.getClassQuantile(classSize);
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
    let previousIndex=0;
    ranges.forEach(function(item, index) {
      // get the start and end values for the current range
      const sliced = item.split(' - ');
      const startRange = Number(sliced[0]);
      let endRange = Number(sliced[1]);// to increase the range

      // get the values in the series for the current
      let values = HistogramBuilderService.fetchValuesInRange(series, startRange, endRange+0.0001);
      
      // Logic for naming the bins. Taking into account the previous bin length.
      let newIndex=null;
      if(values.length!=0){
          newIndex=previousIndex+1;
          previousIndex+=1;
      }else{
          newIndex=0;
      }
      
      // create color array (per Plotly spec)
//      const targetColor = HistogramBuilderService.fetchHistogramColorForIndex(newIndex);
//      const colorArray = [];
//      values.forEach(function(){
//        colorArray.push(targetColor);
//      });
      
      // create a frequency data item (per Plotly spec)
      const freqItem = {
        name: 'Bin ' + newIndex + ' (' + startRange.toFixed(2) + ' to ' + endRange.toFixed(2) + ')',
        x: values,
        type: 'histogram',
        marker: { color:  null},
        autobinx: false,
        nbinsx: 1,
        xbins: {
          start: startRange,
          end: endRange+0.0001,
          size: (endRange+0.0001) - startRange // values.length
        }
      };

      result.push(freqItem);
    });
    let classesNumber=0;
    result.forEach(item=>{
        if(typeof(item.name.split(' ')[1])!='undefined' && item.name.split(' ')[1]!='0'){
            classesNumber++;
        }
    });
    result.forEach(item=>{
        if(typeof(item.name.split(' ')[1])!='undefined' && item.name.split(' ')[1]!='0'){
            item.marker.color=HistogramBuilderService.fetchHistogramColorForIndex(item.name.split(' ')[1],classesNumber);
        }
    });
    return result;
  }

  /**
   * Utility for creating the data object for an un-classified histogram.
   * @param {number[]} series
   * @param {numberOfBins} the number of bins
   */
  static createUnclassifiedHistogramDataObject(series: number[], numberOfBins: any) {
      //console.log(numberOfBins);
    // build histogram data object per the Plotly spec
    return [{
      x: series,
      type: 'histogram',
      nbinsx: numberOfBins
    }];
  }
  
  /**
   * For presenting an empty histogram.
   * @param Plotly
   */
  static createEmptyHistogram(Plotly: any) {

    const sampleData = {'message': 'success', 'results': []};
    const frequencyData: number[] = [];
    for (const item of sampleData.results) {
      frequencyData.push(item['v']);
    }

    const histogramData = HistogramBuilderService.createUnclassifiedHistogramDataObject(frequencyData, frequencyData.length);
    const layout = {
      title: 'Histogram',
      yaxis: { title: 'Count'},
      bargap: 0.05,
      hovermode: 'closest',
      showlegend: false
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
