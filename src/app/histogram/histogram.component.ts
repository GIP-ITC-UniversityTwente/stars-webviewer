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

  chartIsActive=false;
  selectedFieldConstantCharacteristicId: number;
  fieldConstantCharacteristics: any[] = [];
  selectedNumberOfBins: any;
  numberOfBins: any[] = [];
  selectedClassificationMethod: string;
  classificationMethods: string[] = [];
  selectedClassSize: any;
  classSizes: number[] = [];
  frequencyData: number[] = [];
  fieldConstantData: any[] = [];
  classifiedFmuIDs: any[] = [];//same as binCollection but with the fmu's ID
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
          this.chartIsActive=false;
          this.fieldConstantCharacteristics=[];
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
    this.chartIsActive=false;
    this.selectedClassificationMethod = undefined;
    this.classificationMethods = [];
    this.selectedClassSize = undefined;
    this.classSizes = [];
    this.fieldConstantData=[];
    
    // fetch field constants
    this.starsAPIService.fetchFieldConstantData(this.studyArea['properties']['id'], this.startYear, this.endYear, this.selectedFieldConstantCharacteristicId, this.cropTypes).then((response) => {
      return response;
    }).then((data) => {

      //
//      console.log('field constant data ...');
//      console.log(JSON.stringify(data.results));

      // clear frequency data from a previously chosen field constant characteristic
      if (this.frequencyData.length > 0) {
        this.frequencyData = [];
        this.fieldConstantData=[];
      }
      
      this.fieldConstantData=data.results;
      
      // initialize (or update) frequency data
      for (const item of data.results) {
        this.frequencyData.push(item['v']);
      }

      // initialize the number of bins
//      this.frequencyData.forEach((item, index) => {
//        if(index >= 1) { // the value of 2 is the lowest number of bins allowed
//          this.numberOfBins.push(index + 1);
//        }
//      });
      this.numberOfBins=['auto','2','3','4','5','6','7','8','9','10'];
      this.selectedNumberOfBins='auto';
      this.selectedClassSize=this.selectedNumberOfBins;
//      // create a un-classified histogram
//      const histoData = HistogramBuilderService.createUnclassifiedHistogramDataObject(this.frequencyData, this.selectedNumberOfBins);
//      this.chartIsActive=true;
//      this.presentHistogramData(histoData, false);
//      console.log('Histodata',histoData);
//      
//      
//      // hold on to the defined bins after the histogram is created
//      this.binStart = histoData[0]['xbins']['start'];
//      this.binEnd = histoData[0]['xbins']['end'];
//      this.binSize = histoData[0]['xbins']['size'];

      // populate number of classes (for now this is standardized as 1-5 and is not dynamic)
      //this.classSizes = [1, 2, 3, 4, 5];
      
     // clear down flowing drop downs and charts
      this.selectedClassificationMethod = undefined;
      this.classificationMethods = [];

      // present the classification methods
      if (this.classificationMethods.length !== HistogramBuilderService.classificationMethods.length) {
        this.classificationMethods = HistogramBuilderService.classificationMethods;
      }
   // if no classification method is selected we select the first
      if(typeof(this.selectedClassificationMethod)=='undefined'){
       
          this.selectedClassificationMethod=this.classificationMethods[0];
      }
      
      
      this.onNumberOfBinsChange();
      
      
      
      
    }).catch((error) => {
      console.log(error);
      HistogramBuilderService.createEmptyHistogram(Plotly);
      this.chartIsActive=false;
    });
  }

  /**
   * For handling when a user changes the number of bins
   */
  onNumberOfBinsChange() {

    // clear down flowing drop downs and charts
    HistogramBuilderService.createEmptyHistogram(Plotly);
    this.chartIsActive=false;
    //this.selectedClassificationMethod = undefined;
    //this.classificationMethods = [];
    //this.selectedClassSize = undefined;
    //this.classSizes = [];
    
    this.selectedClassSize=this.selectedNumberOfBins;
//    console.log(this.selectedClassSize);

    //this.selectedClassificationMethod='Default (plotly based)';
//    console.log(this.selectedClassificationMethod);
    // plotly based classification can handle the auto.
    if (this.selectedClassificationMethod=='Default (plotly based)'){
//        console.log('automatic');
        ////////////////////////////////////////////////////////////////////////////////////////////////
        // create a un-classified histogram
        let histoData = HistogramBuilderService.createUnclassifiedHistogramDataObject(this.frequencyData, this.selectedNumberOfBins);
        this.chartIsActive=false;
        this.presentHistogramData(histoData, false);
        
//        console.log(histoData);
        // hold on to the defined bins after the histogram is created
        this.binStart = histoData[0]['xbins']['start'];
        this.binEnd = histoData[0]['xbins']['end'];
        this.binSize = histoData[0]['xbins']['size'];

//        console.log('the bin start is: ', this.binStart);
//        console.log('the bin end is: ', this.binEnd);
//        console.log('the bin size is: ', this.binSize);
        
        // create a collection of bins & create a collection of midpoints for each bin
        this.classifiedFmuIDs=[];
        
        const binCollection = [];
//        const midBinValues = [];
        let currentStart = this.binStart;
        let currentEnd = this.binStart;
        let fieldConstantData=this.fieldConstantData;
        let classifiedFmuIDs=this.classifiedFmuIDs;
        while (currentEnd < this.binEnd) {
          // define the start and end for the current bin
          currentEnd += this.binSize;
          currentStart = currentEnd - this.binSize;
          
//          console.log('currentStart is: ', currentStart, ' currentEnd is: ', currentEnd);


          // find the frequency data values that should be in the current bin
          const currentBin = [];
          this.frequencyData.forEach(function(item){
            if (item > currentStart && item <= currentEnd) {
              currentBin.push(item);
            }
          });

          binCollection.push(currentBin);
              
//           // create the mid value for the bin
//              const midPoint = Number(((currentStart + currentEnd) / 2).toPrecision(3));
//              midBinValues.push(midPoint);
        }

        //
//        console.log('the frequency data: ', this.frequencyData.sort());
//        console.log('the binCollection: ', JSON.stringify(binCollection));
//        console.log('the mid point values: ', midBinValues);

        
//        // derive a collection that is like binCollection but replaces each item with the representative median value
//        const medianBinCollection = [];
//        binCollection.forEach(function(item, index) {
//          let numberOfItems = item.length;
//          const medianArray = [];
//          while (numberOfItems > 0) {
//            const targetMedianValue = midBinValues[index];
//            medianArray.push(targetMedianValue);
//            numberOfItems -= 1;
//          }
//          medianBinCollection.push(medianArray);
//        });

        //
        //console.log('the midpoint repeated for each bin: ', JSON.stringify(medianBinCollection));

//        // flatten out from an array of arrays to a single array
//        const flatMedianBinCollection = [];
//        medianBinCollection.forEach(function(item) {
//          item.forEach(function(subItem) {
//            flatMedianBinCollection.push(subItem);
//          });
//        });
        
        //console.log('the flattened midpoint collection is: ', JSON.stringify(flatMedianBinCollection));
        // flatten out from an array of arrays of binCollection to a single array
        const flatBinCollection = [];
        binCollection.forEach(function(item) {
          item.forEach(function(subItem) {
              flatBinCollection.push(subItem);
          });
        });

        // classify the data
        let newRanges=HistogramBuilderService.classifyAutomaticBins(this.binStart,this.binEnd,this.binSize);
        // create histogram data
        histoData = HistogramBuilderService.createClassifiedHistogramDataObject(flatBinCollection, newRanges);
        this.chartIsActive=true;

        //
        //console.log('the histo data: ', histoData);
       
        // display histogram data
        this.presentHistogramData(histoData, true,true);
        
        
        // get the classified FMU's out of the histData object
        let classifiedFmuColors=[];
        histoData.forEach(function(item:any) {
            // get color
            classifiedFmuColors.push(item.marker.color);
            //console.log(item.x);
            let currentClassFmusIDs=[];
            item.x.forEach(function(subitem) {
                const obj = fieldConstantData.find(o => o.v === subitem);
                currentClassFmusIDs.push(obj.i);
            });
            classifiedFmuIDs.push(currentClassFmusIDs);
        });

        // broadcast classes and groups to other components
        this.userSelectionService.updateClassifiedFmuIDs(classifiedFmuIDs,classifiedFmuColors);
        ////////////////////////////////////////////////////////////////////////////////////////////////
    }
    else if (this.selectedNumberOfBins=='auto' && this.selectedClassificationMethod!='Default (plotly based)'){
        console.log('auto but manual classification')
        // create a un-classified histogram to get the number of bins created by plotly
        let histoData = HistogramBuilderService.createUnclassifiedHistogramDataObject(this.frequencyData, this.selectedNumberOfBins);
        this.chartIsActive=false;
        this.presentHistogramData(histoData, false);
        
//        console.log(histoData);
        // hold on to the defined bins after the histogram is created
        this.binStart = histoData[0]['xbins']['start'];
        this.binEnd = histoData[0]['xbins']['end'];
        this.binSize = histoData[0]['xbins']['size'];
        let newRanges=HistogramBuilderService.classifyAutomaticBins(this.binStart,this.binEnd,this.binSize);
        const numberOfBins=newRanges.length;
        this.selectedClassSize=numberOfBins;
        
        ////////////////////////////////////////////////////////////////////////////////////////
//        console.log('the bin start is: ', this.binStart);
//        console.log('the bin end is: ', this.binEnd);
//        console.log('the bin size is: ', this.binSize);
        
        // create a collection of bins & create a collection of midpoints for each bin
        this.classifiedFmuIDs=[];
        
        const binCollection = [];
        //const midBinValues = [];
        let currentStart = this.binStart;
        let currentEnd = this.binStart;
        let fieldConstantData=this.fieldConstantData;
        let classifiedFmuIDs=this.classifiedFmuIDs;
        while (currentEnd < this.binEnd) {
          // define the start and end for the current bin
          currentEnd += this.binSize;
          currentStart = currentEnd - this.binSize;
          
//          console.log('currentStart is: ', currentStart, ' currentEnd is: ', currentEnd);

          

          // find the frequency data values that should be in the current bin
          const currentBin = [];
          this.frequencyData.forEach(function(item){
            if (item > currentStart && item <= currentEnd) {
              currentBin.push(item);
            }
          });
       // readjust number of classes or bins so we don't have empty ones!
//          if(currentBin.length>0){
              //console.log('LAST currentStart is: ', currentStart, ' currentEnd is: ', currentEnd);
              // add the current bin into the bin collection
              binCollection.push(currentBin);
              //console.log('currentBin ',currentBin);
              
//           // create the mid value for the bin
//              const midPoint = Number(((currentStart + currentEnd) / 2).toPrecision(4));
//              
//              midBinValues.push(midPoint);
//          } else{
//              console.log('------------------> Empty class removed!');
//          }
       
          //this.selectedClassSize=binCollection.length;
        }

        //
//        console.log('the frequency data: ', this.frequencyData.sort());
//        console.log('the binCollection: ', JSON.stringify(binCollection));
//        console.log('the mid point values: ', midBinValues);
        
        
        
//        // derive a collection that is like binCollection but replaces each item with the representative median value
//        const medianBinCollection = [];
//        binCollection.forEach(function(item, index) {
//          let numberOfItems = item.length;
//          const medianArray = [];
//          while (numberOfItems > 0) {
//            const targetMedianValue = midBinValues[index];
//            medianArray.push(targetMedianValue);
//            numberOfItems -= 1;
//          }
//          medianBinCollection.push(medianArray);
//        });

        //
        //console.log('the midpoint repeated for each bin: ', JSON.stringify(medianBinCollection));

//        // flatten out from an array of arrays to a single array
//        const flatMedianBinCollection = [];
//        medianBinCollection.forEach(function(item) {
//          item.forEach(function(subItem) {
//            flatMedianBinCollection.push(subItem);
//          });
//        });
        
        //console.log('the flattened midpoint collection is: ', JSON.stringify(flatMedianBinCollection));
        // flatten out from an array of arrays of binCollection to a single array
        const flatBinCollection = [];
        binCollection.forEach(function(item) {
          item.forEach(function(subItem) {
              flatBinCollection.push(subItem);
          });
        });
        //console.log('the flattened binCollection is: ', JSON.stringify(flatBinCollection));
        //

//        console.log(this.selectedClassificationMethod);
//        console.log(this.selectedClassSize);

        // series using the medians repeated for each bin
        this.geostatSeries = new geostats(flatBinCollection);
//        console.log('geostatSeries ',this.geostatSeries)

        // classify the data
        
        HistogramBuilderService.classifySeries(this.selectedClassificationMethod, this.selectedClassSize, this.geostatSeries);
//        console.log('geostatSeries after classify ',this.geostatSeries)
//        console.log('selectedClassSize ',this.selectedClassSize);
        // create histogram data
        histoData = HistogramBuilderService.createClassifiedHistogramDataObject(flatBinCollection, this.geostatSeries.ranges);
        this.chartIsActive=true;

        //
//        console.log('the histo data: ', histoData);
       
        // display histogram data
        this.presentHistogramData(histoData, true,true);
        
        
        // get the classified FMU's out of the histData object
        let classifiedFmuColors=[];
        histoData.forEach(function(item:any) {
            // get color
            classifiedFmuColors.push(item.marker.color);
            //console.log(item.x);
            let currentClassFmusIDs=[];
            item.x.forEach(function(subitem) {
                const obj = fieldConstantData.find(o => o.v === subitem);
                currentClassFmusIDs.push(obj.i);
            });
            classifiedFmuIDs.push(currentClassFmusIDs);
        });

        // broadcast classes and groups to other components
        this.userSelectionService.updateClassifiedFmuIDs(classifiedFmuIDs,classifiedFmuColors);
        ////////////////////////////////////////////////////////////////////////////////////////////
    }
    else if (this.selectedNumberOfBins!='auto' && this.selectedClassificationMethod!='Default (plotly based)') {
//        console.log('NOT auto and manual classification');
        
        this.selectedClassSize=this.selectedNumberOfBins;
        
        ////////////////////////////////////////////////////////////////////////////////////////
//        console.log('the bin start is: ', this.binStart);
//        console.log('the bin end is: ', this.binEnd);
//        console.log('the bin size is: ', this.binSize);
        
        // create a collection of bins & create a collection of midpoints for each bin
        this.classifiedFmuIDs=[];
        
        const binCollection = [];
//        const midBinValues = [];
        let currentStart = this.binStart;
        let currentEnd = this.binStart;
        let fieldConstantData=this.fieldConstantData;
        let classifiedFmuIDs=this.classifiedFmuIDs;
        while (currentEnd < this.binEnd) {
          // define the start and end for the current bin
          currentEnd += this.binSize;
          currentStart = currentEnd - this.binSize;
          
//          console.log('currentStart is: ', currentStart, ' currentEnd is: ', currentEnd);

          

          // find the frequency data values that should be in the current bin
          const currentBin = [];
          this.frequencyData.forEach(function(item){
            if (item > currentStart && item <= currentEnd) {
              currentBin.push(item);
            }
          });
       // readjust number of classes or bins so we don't have empty ones!
//          if(currentBin.length>0){
              //console.log('LAST currentStart is: ', currentStart, ' currentEnd is: ', currentEnd);
              // add the current bin into the bin collection
              binCollection.push(currentBin);
              //console.log('currentBin ',currentBin);
              
//           // create the mid value for the bin
//              const midPoint = Number(((currentStart + currentEnd) / 2).toPrecision(3));
//              midBinValues.push(midPoint);
//          } else{
//              console.log('------------------> Empty class removed!');
//          }
       
          //this.selectedClassSize=binCollection.length;
        }

        //
//        console.log('the frequency data: ', this.frequencyData.sort());
//        console.log('the binCollection: ', JSON.stringify(binCollection));
//        console.log('the mid point values: ', midBinValues);
        
        
        
//        // derive a collection that is like binCollection but replaces each item with the representative median value
//        const medianBinCollection = [];
//        binCollection.forEach(function(item, index) {
//          let numberOfItems = item.length;
//          const medianArray = [];
//          while (numberOfItems > 0) {
//            const targetMedianValue = midBinValues[index];
//            medianArray.push(targetMedianValue);
//            numberOfItems -= 1;
//          }
//          medianBinCollection.push(medianArray);
//        });

        //
        //console.log('the midpoint repeated for each bin: ', JSON.stringify(medianBinCollection));
//
//        // flatten out from an array of arrays to a single array
//        const flatMedianBinCollection = [];
//        medianBinCollection.forEach(function(item) {
//          item.forEach(function(subItem) {
//            flatMedianBinCollection.push(subItem);
//          });
//        });
        
        //console.log('the flattened midpoint collection is: ', JSON.stringify(flatMedianBinCollection));
        // flatten out from an array of arrays of binCollection to a single array
        const flatBinCollection = [];
        binCollection.forEach(function(item) {
          item.forEach(function(subItem) {
              flatBinCollection.push(subItem);
          });
        });
        //console.log('the flattened binCollection is: ', JSON.stringify(flatBinCollection));
        //
//
//        console.log(this.selectedClassificationMethod);
//        console.log(this.selectedClassSize);

        // series using the medians repeated for each bin
        this.geostatSeries = new geostats(flatBinCollection);
//        console.log('geostatSeries ',this.geostatSeries)

        // classify the data
        
        HistogramBuilderService.classifySeries(this.selectedClassificationMethod, this.selectedClassSize, this.geostatSeries);
//        console.log('geostatSeries after classify ',this.geostatSeries)
//        console.log('selectedClassSize ',this.selectedClassSize);
        // create histogram data
        let histoData = HistogramBuilderService.createClassifiedHistogramDataObject(flatBinCollection, this.geostatSeries.ranges);
        this.chartIsActive=true;

        //
        //console.log('the histo data: ', histoData);
       
        // display histogram data
        this.presentHistogramData(histoData, true,true);
        
        
        // get the classified FMU's out of the histData object
        let classifiedFmuColors=[];
        histoData.forEach(function(item) {
            // get color
            classifiedFmuColors.push(item.marker.color);
            //console.log(item.x);
            let currentClassFmusIDs=[];
            item.x.forEach(function(subitem) {
                const obj = fieldConstantData.find(o => o.v === subitem);
                currentClassFmusIDs.push(obj.i);
            });
            classifiedFmuIDs.push(currentClassFmusIDs);
        });

        // broadcast classes and groups to other components
        this.userSelectionService.updateClassifiedFmuIDs(classifiedFmuIDs,classifiedFmuColors);
        ////////////////////////////////////////////////////////////////////////////////////////////
        
    }
    

    

    
    // clear down flowing drop downs and charts
    //this.selectedClassificationMethod = undefined;
    //this.classificationMethods = [];

    // present the classification methods
    //if (this.classificationMethods.length !== HistogramBuilderService.classificationMethods.length) {
    //  this.classificationMethods = HistogramBuilderService.classificationMethods;
   // }
     // by default we select the first classification method
    //this.selectedClassificationMethod=this.classificationMethods[0];
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
    this.selectedClassSize=this.selectedNumberOfBins;
//    console.log(this.selectedClassSize);
    this.onNumberOfBinsChange();
//
//    if(this.selectedClassSize=='auto' || this.selectedClassificationMethod=='Default (plotly based)'){
//        ////////////////////////////////////////////////////////////////////////////////////////////////
//        console.log('automatic');
//        // create a un-classified histogram
//        let histoData = HistogramBuilderService.createUnclassifiedHistogramDataObject(this.frequencyData, this.selectedNumberOfBins);
//        this.chartIsActive=false;
//        this.presentHistogramData(histoData, false);
//        
//        console.log(histoData);
//        // hold on to the defined bins after the histogram is created
//        this.binStart = histoData[0]['xbins']['start'];
//        this.binEnd = histoData[0]['xbins']['end'];
//        this.binSize = histoData[0]['xbins']['size'];
//
//        console.log('the bin start is: ', this.binStart);
//        console.log('the bin end is: ', this.binEnd);
//        console.log('the bin size is: ', this.binSize);
//        
//        // create a collection of bins & create a collection of midpoints for each bin
//        this.classifiedFmuIDs=[];
//        
//        const binCollection = [];
//        const midBinValues = [];
//        let currentStart = this.binStart;
//        let currentEnd = this.binStart;
//        let fieldConstantData=this.fieldConstantData;
//        let classifiedFmuIDs=this.classifiedFmuIDs;
//        while (currentEnd < this.binEnd) {
//          // define the start and end for the current bin
//          currentEnd += this.binSize;
//          currentStart = currentEnd - this.binSize;
//          
//          console.log('currentStart is: ', currentStart, ' currentEnd is: ', currentEnd);
//
//
//          // find the frequency data values that should be in the current bin
//          const currentBin = [];
//          this.frequencyData.forEach(function(item){
//            if (item > currentStart && item <= currentEnd) {
//              currentBin.push(item);
//            }
//          });
//
//          binCollection.push(currentBin);
//              
//           // create the mid value for the bin
//              const midPoint = Number(((currentStart + currentEnd) / 2).toPrecision(3));
//              midBinValues.push(midPoint);
//        }
//
//        //
//        console.log('the frequency data: ', this.frequencyData.sort());
//        console.log('the binCollection: ', JSON.stringify(binCollection));
//        console.log('the mid point values: ', midBinValues);
//
//        
//        // derive a collection that is like binCollection but replaces each item with the representative median value
//        const medianBinCollection = [];
//        binCollection.forEach(function(item, index) {
//          let numberOfItems = item.length;
//          const medianArray = [];
//          while (numberOfItems > 0) {
//            const targetMedianValue = midBinValues[index];
//            medianArray.push(targetMedianValue);
//            numberOfItems -= 1;
//          }
//          medianBinCollection.push(medianArray);
//        });
//
//        //
//        //console.log('the midpoint repeated for each bin: ', JSON.stringify(medianBinCollection));
//
//        // flatten out from an array of arrays to a single array
//        const flatMedianBinCollection = [];
//        medianBinCollection.forEach(function(item) {
//          item.forEach(function(subItem) {
//            flatMedianBinCollection.push(subItem);
//          });
//        });
//        
//        //console.log('the flattened midpoint collection is: ', JSON.stringify(flatMedianBinCollection));
//        // flatten out from an array of arrays of binCollection to a single array
//        const flatBinCollection = [];
//        binCollection.forEach(function(item) {
//          item.forEach(function(subItem) {
//              flatBinCollection.push(subItem);
//          });
//        });
//
//        // classify the data
//        let newRanges=HistogramBuilderService.classifyAutomaticBins(this.binStart,this.binEnd,this.binSize);
//        // create histogram data
//        histoData = HistogramBuilderService.createClassifiedHistogramDataObject(flatBinCollection, newRanges);
//        this.chartIsActive=true;
//
//        //
//        //console.log('the histo data: ', histoData);
//       
//        // display histogram data
//        this.presentHistogramData(histoData, true,true);
//        
//        
//        // get the classified FMU's out of the histData object
//        histoData.forEach(function(item) {
//            //console.log(item.x);
//            let currentClassFmusIDs=[];
//            item.x.forEach(function(subitem) {
//                const obj = fieldConstantData.find(o => o.v === subitem);
//                currentClassFmusIDs.push(obj.i);
//            });
//            classifiedFmuIDs.push(currentClassFmusIDs);
//        });
//
//        // broadcast classes and groups to other components
//        this.userSelectionService.updateClassifiedFmuIDs(classifiedFmuIDs);
//        
//        ////////////////////////////////////////////////////////////////////////////////////////////////
//
//        
////        // populate number of classes (for now this is standardized as 1-5 and is not dynamic)
////        this.classSizes = [1, 2, 3, 4, 5];
////        
////        // clear down flowing drop downs and charts
////        this.selectedClassificationMethod = undefined;
////        this.classificationMethods = [];
////
////        // present the classification methods
////        if (this.classificationMethods.length !== HistogramBuilderService.classificationMethods.length) {
////          this.classificationMethods = HistogramBuilderService.classificationMethods;
////        }
////         // by default we select the first classification method
////        this.selectedClassificationMethod=this.classificationMethods[0];
//        
//        return
//    }else{
//        
//        console.log('the bin start is: ', this.binStart);
//        console.log('the bin end is: ', this.binEnd);
//        console.log('the bin size is: ', this.binSize);
//        ////////////////////////////////////////////////////////////////////////////////////////////////
//        // create a collection of bins & create a collection of midpoints for each bin
//        this.classifiedFmuIDs=[];
//        
//        const binCollection = [];
//        const midBinValues = [];
//        let currentStart = this.binStart;
//        let currentEnd = this.binStart;
//        let fieldConstantData=this.fieldConstantData;
//        let classifiedFmuIDs=this.classifiedFmuIDs;
//        while (currentEnd < this.binEnd) {
//          // define the start and end for the current bin
//          currentEnd += this.binSize;
//          currentStart = currentEnd - this.binSize;
//          
//          console.log('currentStart is: ', currentStart, ' currentEnd is: ', currentEnd);
//
//          
//
//          // find the frequency data values that should be in the current bin
//          const currentBin = [];
//          this.frequencyData.forEach(function(item){
//            if (item > currentStart && item <= currentEnd) {
//              currentBin.push(item);
//            }
//          });
//       // readjust number of classes or bins so we don't have empty ones!
////          if(currentBin.length>0){
//              //console.log('LAST currentStart is: ', currentStart, ' currentEnd is: ', currentEnd);
//              // add the current bin into the bin collection
//              binCollection.push(currentBin);
//              //console.log('currentBin ',currentBin);
//              
//           // create the mid value for the bin
//              const midPoint = Number(((currentStart + currentEnd) / 2).toPrecision(3));
//              midBinValues.push(midPoint);
////          } else{
////              console.log('------------------> Empty class removed!');
////          }
//       
//          //this.selectedClassSize=binCollection.length;
//        }
//
//        //
//        console.log('the frequency data: ', this.frequencyData.sort());
//        console.log('the binCollection: ', JSON.stringify(binCollection));
//        console.log('the mid point values: ', midBinValues);
//        
//        
//        
//        // derive a collection that is like binCollection but replaces each item with the representative median value
//        const medianBinCollection = [];
//        binCollection.forEach(function(item, index) {
//          let numberOfItems = item.length;
//          const medianArray = [];
//          while (numberOfItems > 0) {
//            const targetMedianValue = midBinValues[index];
//            medianArray.push(targetMedianValue);
//            numberOfItems -= 1;
//          }
//          medianBinCollection.push(medianArray);
//        });
//
//        //
//        //console.log('the midpoint repeated for each bin: ', JSON.stringify(medianBinCollection));
//
//        // flatten out from an array of arrays to a single array
//        const flatMedianBinCollection = [];
//        medianBinCollection.forEach(function(item) {
//          item.forEach(function(subItem) {
//            flatMedianBinCollection.push(subItem);
//          });
//        });
//        
//        //console.log('the flattened midpoint collection is: ', JSON.stringify(flatMedianBinCollection));
//        // flatten out from an array of arrays of binCollection to a single array
//        const flatBinCollection = [];
//        binCollection.forEach(function(item) {
//          item.forEach(function(subItem) {
//              flatBinCollection.push(subItem);
//          });
//        });
//        //console.log('the flattened binCollection is: ', JSON.stringify(flatBinCollection));
//        //
//
//        console.log(this.selectedClassificationMethod);
//        console.log(this.selectedClassSize);
//
//        
//        // series using the medians repeated for each bin
//        this.geostatSeries = new geostats(flatMedianBinCollection);
//        console.log('geostatSeries ',this.geostatSeries)
//
//        // classify the data
//        
//        HistogramBuilderService.classifySeries(this.selectedClassificationMethod, this.selectedClassSize, this.geostatSeries);
//        console.log('geostatSeries after classify ',this.geostatSeries)
//        console.log('selectedClassSize ',this.selectedClassSize);
//        // create histogram data
//        const histoData = HistogramBuilderService.createClassifiedHistogramDataObject(flatBinCollection, this.geostatSeries.ranges);
//        this.chartIsActive=true;
//
//        //
//        //console.log('the histo data: ', histoData);
//       
//        // display histogram data
//        this.presentHistogramData(histoData, true,true);
//        
//        
//        // get the classified FMU's out of the histData object
//        
//        histoData.forEach(function(item) {
//            //console.log(item.x);
//            let currentClassFmusIDs=[];
//            item.x.forEach(function(subitem) {
//                const obj = fieldConstantData.find(o => o.v === subitem);
//                currentClassFmusIDs.push(obj.i);
//            });
//            classifiedFmuIDs.push(currentClassFmusIDs);
//        });
//
//        // broadcast classes and groups to other components
//        this.userSelectionService.updateClassifiedFmuIDs(classifiedFmuIDs);
//        ////////////////////////////////////////////////////////////////////////////////////////////////
//    }

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

