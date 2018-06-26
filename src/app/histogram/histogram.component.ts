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
  classSizes: number[] = [];
  frequencyData: number[] = [];
  binStart: number;
  binEnd: number;
  binSize: number;
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
        }
      }
    );
  }

  /**
   * Life-cycle hook after component is created.
   */
  ngOnInit() { }


  /**
   * For handling when a user changes the target field characteristic.
   */
  onFieldConstantChange() {

    // clear down flowing drop downs and charts
    this.numberOfBins = [];
    this.selectedNumberOfBins = undefined;
    HistogramBuilderService.createEmptyHistogram(Plotly);
    this.selectedClassificationMethod = undefined;
    this.classificationMethods = [];
    this.selectedClassSize = undefined;
    this.classSizes = [];

    // fetch field constants
    this.starsAPIService.fetchFieldConstantData(this.studyArea['properties']['id'], this.startYear, this.endYear, this.selectedFieldConstantCharacteristicId, this.cropTypes).then((response) => {
      return response;
    }).then((data) => {

      //
      console.log('field constant data ...');
      console.log(JSON.stringify(data.results));

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

    // clear down flowing drop downs and charts
    HistogramBuilderService.createEmptyHistogram(Plotly);
    this.selectedClassificationMethod = undefined;
    this.classificationMethods = [];
    this.selectedClassSize = undefined;
    this.classSizes = [];

    // create a un-classified histogram
    const histoData = HistogramBuilderService.createUnclassifiedHistogramDataObject(this.frequencyData, this.selectedNumberOfBins);
    this.presentHistogramData(histoData, false);

    // hold on to the defined bins after the histogram is created
    this.binStart = histoData[0]['xbins']['start'];
    this.binEnd = histoData[0]['xbins']['end'];
    this.binSize = histoData[0]['xbins']['size'];

    // populate number of classes (for now this is standardized as 1-5 and is not dynamic)
    this.classSizes = [1, 2, 3, 4, 5];
  }

  /**
   * For handling when a user changes the number of classes when viewing the frequency data.
   */
  onClassSizeChange() {

    // clear down flowing drop downs and charts
    this.selectedClassificationMethod = undefined;
    this.classificationMethods = [];

    // present the classification methods
    if (this.classificationMethods.length !== HistogramBuilderService.classificationMethods.length) {
      this.classificationMethods = HistogramBuilderService.classificationMethods;
    }
  }

  /**
   * For handling when a user changes the target classification when viewing the frequency data.
   */
  onClassificationChange() {

    console.log('the bin start is: ', this.binStart);
    console.log('the bin end is: ', this.binEnd);
    console.log('the bin size is: ', this.binSize);

    // create a collection of bins & create a collection of midpoints for each bin
    const binCollection = [];
    const midBinValues = [];
    let currentStart = this.binStart;
    let currentEnd = this.binStart;
    while (currentEnd < this.binEnd) {

      // define the start and end for the current bin
      currentEnd += this.binSize;
      currentStart = currentEnd - this.binSize;
      //
      console.log('currentStart is: ', currentStart, ' currentEnd is: ', currentEnd);

      // create the mid value for the bin
      const midPoint = Number(((currentStart + currentEnd) / 2).toPrecision(3));
      midBinValues.push(midPoint);

      // find the frequency data values that should be in the current bin
      const currentBin = [];
      this.frequencyData.forEach(function(item){
        if (item > currentStart && item <= currentEnd) {
          currentBin.push(item);
        }
      });

      // add the current bin into the bin collection
      binCollection.push(currentBin);
    }

    //
    console.log('the frequency data: ', this.frequencyData.sort());
    console.log('the binCollection: ', JSON.stringify(binCollection));
    console.log('the mid point values: ', midBinValues);

    // derive a collection that is like binCollection but replaces each item with the representative median value
    const medianBinCollection = [];
    binCollection.forEach(function(item, index) {
      let numberOfItems = item.length;
      const medianArray = [];
      while (numberOfItems > 0) {
        const targetMedianValue = midBinValues[index];
        medianArray.push(targetMedianValue);
        numberOfItems -= 1;
      }
      medianBinCollection.push(medianArray);
    });

    //
    console.log('the midpoint repeated for each bin: ', JSON.stringify(medianBinCollection));

    // flatten out from an array of arrays to a single array
    const flatMedianBinCollection = [];
    medianBinCollection.forEach(function(item) {
      item.forEach(function(subItem) {
        flatMedianBinCollection.push(subItem);
      });
    });

    //
    console.log('the flattened midpoint collection is: ', JSON.stringify(flatMedianBinCollection));

    // series using the medians repeated for each bin
    this.geostatSeries = new geostats(flatMedianBinCollection);


    // classify the data
    HistogramBuilderService.classifySeries(this.selectedClassificationMethod, this.selectedClassSize, this.geostatSeries);

    // create histogram data
    const histoData = HistogramBuilderService.createClassifiedHistogramDataObject(flatMedianBinCollection, this.geostatSeries.ranges);

    //
    console.log('the histo data: ', histoData);

    // display histogram data
    this.presentHistogramData(histoData, true,true);

    // TODO: DEFINE THE INPUT TO THE CLASSIFIED HISTOGRAM SECTION
    // TODO: BROADCAST TO COMPONENT THAT WE ARE READY TO SHOW THE CLASSIFIED HISTOGRAM
    // - - - START TESTING API CALL

    // broadcast classes and groups to other components
    
    
    /*
    const tempImageCharId = 1;
    this.starsAPIService.fetchFieldClassifiedTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, tempImageCharId, this.cropTypes, '1085;1105,1230,1115;1220,1160,1120,1165,1025,1060', 'bin0,bin1,bin2').then((response) => {
      return response;
    }).then((data) => {
      //
      console.log('data', data);
    }).catch((error) => {
      //
      console.log(error);
    });
    */

    const tempImageCharId = 1060;
    this.starsAPIService.fetchFieldClassifiedTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, tempImageCharId, this.cropTypes, '1085;1105,1230,1115;1160,1220,1120,1165,1025,1060', 'class0,class1,class2').then((response) => {
      return response;
    }).then((data) => {
      //
      //console.log('data', data);
      // inform other components that the grouped data exists
      this.userSelectionService.updateGroupedTimeSeriesData(data);
      
    }).catch((error) => {
      //
      console.log(error);
    });

    // - - - END TESTING API CALL
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
   * @param {boolean} isHistogram
   */
  presentHistogramData(histogramData: any, isShowing: boolean,isHistogram:boolean=false) {

    const targetFieldConstantAlias = this.lookUpFieldConstantName(this.selectedFieldConstantCharacteristicId);
    let layout={};
    if(isHistogram){
        layout = {
                title: 'Classified histogram of ' + targetFieldConstantAlias,
                yaxis: { title: 'Count'},
                bargap: 0.05,
                hovermode: 'closest',
                showlegend: isShowing
              };
    }else{
        layout = {
                title: 'Histogram of ' + targetFieldConstantAlias,
                yaxis: { title: 'Count'},
                bargap: 0.05,
                hovermode: 'closest',
                showlegend: isShowing
              };

    }
    
    
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

