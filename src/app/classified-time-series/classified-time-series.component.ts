import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AppConfiguration } from '../app-configuration';
import { StarsAPIService } from '../services/stars-api.service';
import { UserSelectionService } from '../services/user-selection.service';
import { TimeSeriesBuilderService } from '../services/time-series-builder.service';

declare const Plotly: any;
declare const chroma: any;
@Component({
  selector: 'app-classified-time-series',
  templateUrl: './classified-time-series.component.html',
  styleUrls: ['./classified-time-series.component.css']
})
export class ClassifiedTimeSeriesComponent implements OnInit, OnDestroy {

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

  subscriptionToChart1TimeSeriesStatus: Subscription;
  chart1TimeSeriesStatus:any;

  subscriptionToClassifiedFmuIDs: Subscription;
  classifiedFmuIDs: any;
  
  leftPanelisTicked=false;
  studyAreaId: number;
  cropList: string;
  characteristicTypes: string[] = [];
  imageTypes: string[] = [];
  fieldTypes: any[] = [];
  allSpectralCharacteristicObjects: any[] = [];
  allTexturalCharacteristicObjects: any[] = [];

  //classesList: string='Class%201,Class%202,Class%203,Class%204';
  //fmusList: string='1105,1230,30440,30530,30550,30595,1115,1120,1160,1165,1220,30415,30425,30435,30485,30495,30500,30555,30610;1025,1060,30430,30455,30525;30535;30410';
  classesList: string;
  fmusList: string;
  chart1CharacteristicsTypeDisabled = true;
  chart1DropDownsAreDisabled = false;
  chart1ImageOptionsAreVisible = false;
  chart1FieldOptionsAreVisible = false;
  chart1CharacteristicTypeIsVisible=false;
  chart1IsActive=false;
  chart1SelectedCharacteristicType: string;
  chart1SelectedImageType: string;
  chart1ImageCharacteristics: any[] = [];
  chart1SelectedImageCharacteristicName: string;
  chart1SelectedImageCharacteristicId: number;
  chart1SelectedImageCharacteristicUnit: string;
  chart1Sensors: any[] = [];
  selectedChart1Sensor: string;
  chart1SelectedFieldCharacteristicName: string;
  chart1SelectedFieldCharacteristicId: number;
  chart1SelectedFieldCharacteristicUnit:string;

  chart1Parameter1IsVisible = false;
  chart1Parameter1Name: string;
  chart1Parameter1Range: number[];
  chart1SelectedParameter1Option: number;
  chart1Parameter2IsVisible = false;
  chart1Parameter2Name: string;
  chart1Parameter2Range: number[];
  chart1SelectedParameter2Option: number;

  chart2DropDownsAreDisabled = false;
  chart2ImageOptionsAreVisible = false;
  chart2FieldOptionsAreVisible = false;
  chart2SelectedCharacteristicType: string;
  chart2SelectedImageType: string;
  chart2ImageCharacteristics: any[] = [];
  chart2SelectedImageCharacteristicName: string;
  chart2SelectedImageCharacteristicId: number;
  chart2Sensors: any[] = [];
  selectedChart2Sensor: string;
  chart2SelectedFieldCharacteristicName: string;
  chart2SelectedFieldCharacteristicId: number;

  chart2Parameter1IsVisible = false;
  chart2Parameter1Name: string;
  chart2Parameter1Range: number[];
  chart2SelectedParameter1Option: number;
  chart2Parameter2IsVisible = false;
  chart2Parameter2Name: string;
  chart2Parameter2Range: number[];
  chart2SelectedParameter2Option: number;

  // tooltip

  toolTipPosition = 'right';
  classifiedTimeSeriesToolTip = AppConfiguration.classifiedTimeSeriesToolTip;
  
  //time series component objects
  
  /**
   * For dependency injecting needed services.
   */
  constructor(private userSelectionService: UserSelectionService, private starsAPIService: StarsAPIService) {

      // subscribe to the study area selection by the user
      this.subscriptionToSelectedStudyArea = this.userSelectionService.studyArea$.subscribe(
        studyArea => {
          this.studyArea = studyArea;
          this.studyAreaId = studyArea['properties']['id'];

          // Clear chart
          TimeSeriesBuilderService.createEmptyTimeSeriesChart(Plotly, 'classifiedChart1');
          this.chart1IsActive=false;
        }
      );

      // subscribe to the start year selection by the user
      this.subscriptionToSelectedStartYear = this.userSelectionService.startYear$.subscribe(
        startYear => {
          this.startYear = startYear;

          // Clear chart
          TimeSeriesBuilderService.createEmptyTimeSeriesChart(Plotly, 'classifiedChart1');
          this.chart1IsActive=false;

          // initialize characteristic types
          this.characteristicTypes = TimeSeriesBuilderService.fetchCharacteristicTypes();

          // initialize image types
          this.imageTypes = TimeSeriesBuilderService.fetchImageTypes();

          // initialize the image characteristic options
          this.initializeImageCharacteristicsOptions(this.studyAreaId, this.startYear, this.endYear);

          // initializes the field characteristic options
          this.initializeFieldCharacteristicOptions(this.studyAreaId, this.startYear, this.endYear);
        }
      );

      // subscribe to the end year selection by the user
      this.subscriptionToSelectedEndYear = this.userSelectionService.endYear$.subscribe(
        endYear => {
          this.endYear = endYear;

          // Clear chart
          TimeSeriesBuilderService.createEmptyTimeSeriesChart(Plotly, 'classifiedChart1');
          this.chart1IsActive=false;

          // initialize image types
          this.imageTypes = TimeSeriesBuilderService.fetchImageTypes();

          // initialize the image characteristic options
          this.initializeImageCharacteristicsOptions(this.studyAreaId, this.startYear, this.endYear);

          // initializes the field characteristic options
          this.initializeFieldCharacteristicOptions(this.studyAreaId, this.startYear, this.endYear);
          
        }
      );

      // subscribe to crop types selections by the user
      this.subscriptionToSelectedCropTypes = this.userSelectionService.cropTypes$.subscribe(
        cropTypes => {
          if (cropTypes.length === 0) {
            //variable for left panel template info
            this.leftPanelisTicked=false;
            // Disable TimeSeries drop downs
            this.chart1DropDownsAreDisabled = true;
            this.chart1CharacteristicsTypeDisabled=true;
            // Clear chart
            TimeSeriesBuilderService.createEmptyTimeSeriesChart(Plotly, 'classifiedChart1');
            this.chart1IsActive=false;
          } else if (cropTypes.length > 0) {
            //variable for left panel template info
             this.leftPanelisTicked=true;
            // Enable time series drop downs
            this.chart1DropDownsAreDisabled = false;
            this.chart1CharacteristicsTypeDisabled=false;

            // Create Crop List
            this.cropList = TimeSeriesBuilderService.createCropList(cropTypes);

            // Render chart(s)
            this.updateTimeSeries();
          }
        }
      );
      
      // subscribe to Image Selected Characteristics
      this.subscriptionToChart1TimeSeriesStatus = this.userSelectionService.chart1TimeSeriesStatus$.subscribe(
        data => {
            this.chart1TimeSeriesStatus=data;
        }
      );

    // subscribe to the groupedTimeSeriesData
    this.subscriptionToClassifiedFmuIDs = this.userSelectionService.classifiedFmuIDs$.subscribe(
      data => {
        let classifiedFmuIDs=data.classifiedFmuIDs;
        this.classifiedFmuIDs = classifiedFmuIDs;
        //console.log('Grouped timeseries ',classifiedFmuIDs);
        let fmusList=this.fmusList;
        let classesList=this.classesList;
        fmusList='';
        classesList='';
//        console.log(classifiedFmuIDs);
        let previousIndex=0;
        let newIndex=null;
        classifiedFmuIDs.forEach((item,index)=>{
            // Logic for naming the bins. Taking into account the previous bin length.
            if(item.length!=0){
                newIndex=previousIndex+1
                previousIndex+=1;
            }else{
                newIndex=0;
            }
            classesList+='Bin '+newIndex+',';
            let fmusClass='';
            item.forEach((subitem)=>{
                fmusClass+=subitem+',';
            });
            // remove any existing comma at the end or start.
            fmusClass=fmusClass.replace(/,\s*$/, "");
            fmusList+=fmusClass+';'
            
        });
        // remove any existing comma at the end or start.
        classesList=classesList.replace(/,\s*$/, "");
        // remove any existing comma at the end or start.
        fmusList=fmusList.replace(/;\s*$/, "");
        this.fmusList=fmusList;
        this.classesList=classesList;
        this.chart1CharacteristicTypeIsVisible=true;
        //By default select the same as the first timeseries!
        //Check if timeseries chart 1 is active or not. If so copy the same parameters as before.
        if(typeof(this.chart1TimeSeriesStatus.active)!='undefined' && this.chart1TimeSeriesStatus.active==true && this.chart1IsActive==false){
            TimeSeriesBuilderService.createEmptyTimeSeriesChart(Plotly, 'classifiedChart1');
            this.chart1IsActive=false;
            //timeseries chart 1 is active
            this.chart1SelectedCharacteristicType=this.chart1TimeSeriesStatus.chart1SelectedCharacteristicType;
            this.chart1ImageCharacteristics=this.chart1TimeSeriesStatus.chart1ImageCharacteristics;
            // Image
            this.chart1SelectedImageType=this.chart1TimeSeriesStatus.chart1SelectedImageType;
            this.chart1SelectedImageCharacteristicName=this.chart1TimeSeriesStatus.chart1SelectedImageCharacteristicName;
            this.chart1SelectedImageCharacteristicId=this.chart1TimeSeriesStatus.chart1SelectedImageCharacteristicId;
            this.chart1SelectedImageCharacteristicUnit=this.chart1TimeSeriesStatus.chart1SelectedImageCharacteristicUnit;
            this.chart1Sensors=this.chart1TimeSeriesStatus.chart1Sensors;
            this.selectedChart1Sensor=this.chart1TimeSeriesStatus.selectedChart1Sensor;
            this.chart1Parameter1Name=this.chart1TimeSeriesStatus.chart1Parameter1Name;
            this.chart1Parameter1Range=this.chart1TimeSeriesStatus.chart1Parameter1Range;
            this.chart1SelectedParameter1Option=this.chart1TimeSeriesStatus.chart1SelectedParameter1Option;
            this.chart1Parameter2Name=this.chart1TimeSeriesStatus.chart1Parameter2Name;
            this.chart1Parameter2Range=this.chart1TimeSeriesStatus.chart1Parameter2Range;
            this.chart1SelectedParameter2Option=this.chart1TimeSeriesStatus.chart1SelectedParameter2Option;
            //Field
            this.chart1SelectedFieldCharacteristicName=this.chart1TimeSeriesStatus.chart1SelectedFieldCharacteristicName;
            this.chart1SelectedFieldCharacteristicId=this.chart1TimeSeriesStatus.chart1SelectedFieldCharacteristicId;
            this.chart1SelectedFieldCharacteristicUnit=this.chart1TimeSeriesStatus.chart1SelectedFieldCharacteristicUnit;
            
            //Make sure the fields are visible in case they are hidden

            if(typeof(this.chart1TimeSeriesStatus.chart1SelectedImageType)!='undefined' && this.chart1ImageOptionsAreVisible==false ){
                this.chart1ImageOptionsAreVisible=true;
                this.chart1DropDownsAreDisabled=false;
            }
            if(typeof(this.chart1TimeSeriesStatus.chart1SelectedImageCharacteristicName)!='undefined' && this.chart1ImageOptionsAreVisible==false ){
                this.chart1ImageOptionsAreVisible=true;
                this.chart1DropDownsAreDisabled=false;
            }
            if(typeof(this.chart1TimeSeriesStatus.selectedChart1Sensor)!='undefined' && this.chart1ImageOptionsAreVisible==false ){
                this.chart1ImageOptionsAreVisible=true;
                this.chart1DropDownsAreDisabled=false;
            }
            if(typeof(this.chart1TimeSeriesStatus.chart1SelectedParameter1Option)!='undefined' && this.chart1Parameter1IsVisible==false ){
                this.chart1Parameter1IsVisible=true;
                this.chart1DropDownsAreDisabled=false;
            }
            if(typeof(this.chart1TimeSeriesStatus.chart1SelectedParameter2Option)!='undefined' && this.chart1Parameter2IsVisible==false ){
                this.chart1Parameter2IsVisible=true;
                this.chart1DropDownsAreDisabled=false;
            }
            if(typeof(this.chart1TimeSeriesStatus.chart1SelectedFieldCharacteristicName)!='undefined' && this.chart1FieldOptionsAreVisible==false ){
                this.chart1FieldOptionsAreVisible=true;
                this.chart1DropDownsAreDisabled=false;
            }
            
            //In this if we need always to plot a chart. Field or Image
            if(typeof(this.chart1TimeSeriesStatus.chart1SelectedFieldCharacteristicName)!='undefined'){
                //console.log('Field classified chart')
                //Ready to request the classified timeseries and Plot the chart
                this.starsAPIService.fetchFieldClassifiedTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.chart1SelectedFieldCharacteristicId, this.cropList, this.fmusList, this.classesList).then((response) => {
                    return response;
                  }).then((data) => {
                    const chartData = TimeSeriesBuilderService.createFieldClassifiedTimeSeriesData(data,this.classesList);
                    const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedFieldCharacteristicName+' per bin', this.chart1SelectedFieldCharacteristicName,this.chart1SelectedFieldCharacteristicUnit);
                    this.renderFieldCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
                    this.chart1IsActive=true;
                  }).catch((error) => {
                    //
                    console.log(error);
                  });
                
            }else{
                //console.log('Image classified chart');
                
                this.starsAPIService.fetchImageClassifiedTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor, this.chart1SelectedParameter1Option, this.chart1SelectedParameter2Option, this.fmusList, this.classesList).then((response) => {
                    return response;
                  }).then((data) => {
                    const chartData = TimeSeriesBuilderService.createImageClassifiedTimeSeriesData(data,this.classesList);
                    const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageCharacteristicName+' per bin', this.chart1SelectedImageCharacteristicName,this.chart1SelectedImageCharacteristicUnit);
                    this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
                    this.chart1IsActive=true;
                  }).catch((error) => {
                    //
                    console.log(error);
                  });
                
            }
            //const chartData = TimeSeriesBuilderService.createFieldCharacteristicTimeSeriesData(groupedTimeSeriesData);
            //console.log(chartData);
            //const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout('Field Characteristic', this.chart1SelectedFieldCharacteristicName);
            //this.renderFieldCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
        }else{
            //if Timeseries is not active and we have a chart then we should redraw it (we always have a chart sometimes it's empty!)
            if(this.chart1IsActive){
                if(typeof(this.chart1SelectedFieldCharacteristicName)!='undefined'){
                    //console.log('Field classified chart')
                    //Ready to request the classified timeseries and Plot the chart
                    this.starsAPIService.fetchFieldClassifiedTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.chart1SelectedFieldCharacteristicId, this.cropList, this.fmusList, this.classesList).then((response) => {
                        return response;
                      }).then((data) => {
                        const chartData = TimeSeriesBuilderService.createFieldClassifiedTimeSeriesData(data,this.classesList);
                        const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedFieldCharacteristicName+' per bin', this.chart1SelectedFieldCharacteristicName,this.chart1SelectedFieldCharacteristicUnit);
                        this.renderFieldCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
                        this.chart1IsActive=true;
                      }).catch((error) => {
                        //
                        console.log(error);
                      });
                    
                }else{
                    //console.log('Image classified chart');
                    this.starsAPIService.fetchImageClassifiedTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor, this.chart1SelectedParameter1Option, this.chart1SelectedParameter2Option, this.fmusList, this.classesList).then((response) => {
                        return response;
                      }).then((data) => {
                        const chartData = TimeSeriesBuilderService.createImageClassifiedTimeSeriesData(data,this.classesList);
                        const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageCharacteristicName+' per bin', this.chart1SelectedImageCharacteristicName,this.chart1SelectedImageCharacteristicUnit);
                        this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
                        this.chart1IsActive=true;
                      }).catch((error) => {
                        //
                        console.log(error);
                      });
                }
            }else{
                //In case timeseries chart is not active we DO NOTHING for now (the user needs to select parameters manualy)!
            }
            
        }
        
      }
    );

  }

  /**
   * Life-cycle hook after component is created.
   */
  ngOnInit() {
      // create blank time series
      TimeSeriesBuilderService.createDefaultTimeSeriesCharts(Plotly,'classifiedChart1');

      // default style-layout of charts
      this.initializeChartLayout();
  }
  /**
   * Lifecycle hook that is called when destroyed.
   */
  ngOnDestroy() {
    this.subscriptionToSelectedStudyArea.unsubscribe();
    this.subscriptionToSelectedStartYear.unsubscribe();
    this.subscriptionToSelectedEndYear.unsubscribe();
    this.subscriptionToSelectedCropTypes.unsubscribe();
    this.subscriptionToChart1TimeSeriesStatus.unsubscribe();
    this.subscriptionToClassifiedFmuIDs.unsubscribe();
  }
  
  /**
   * For handling when a user taps the info button for the classified section
   */
  handleInfoButtonTap() {
    //console.log('show info for classified section...');
  }

  /**
   * Utility for updating time series charts
   */
  updateTimeSeries() {

    // chart - updates
    if (this.chart1SelectedCharacteristicType === 'Image Characteristic') {
      if (this.selectedChart1Sensor !== undefined && this.chart1SelectedParameter1Option === undefined && this.chart1SelectedParameter2Option === undefined) {
        // update image characteristic time series with no parameters
          this.starsAPIService.fetchImageClassifiedTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor, this.chart1SelectedParameter1Option, this.chart1SelectedParameter2Option, this.fmusList, this.classesList).then((response) => {
              return response;
            }).then((data) => {
              const chartData = TimeSeriesBuilderService.createImageClassifiedTimeSeriesData(data,this.classesList);
              const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageCharacteristicName+' per bin', this.chart1SelectedImageCharacteristicName,this.chart1SelectedImageCharacteristicUnit);
              this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
              this.chart1IsActive=true;
            }).catch((error) => {
              //
              console.log(error);
            });
//        this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor).then((response) => {
//          return response;
//        }).then((data) => {
//          const chartData = TimeSeriesBuilderService.createImageCharacteristicTimeSeriesData(data);
//          const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName);
//          this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
//        });
      } else if (this.selectedChart1Sensor !== undefined && this.chart1SelectedParameter1Option !== undefined && this.chart1SelectedParameter2Option === undefined) {
        // update image characteristic time series with parameter 1
          this.starsAPIService.fetchImageClassifiedTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor, this.chart1SelectedParameter1Option, this.chart1SelectedParameter2Option, this.fmusList, this.classesList).then((response) => {
              return response;
            }).then((data) => {
              const chartData = TimeSeriesBuilderService.createImageClassifiedTimeSeriesData(data,this.classesList);
              const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageCharacteristicName+' per bin', this.chart1SelectedImageCharacteristicName,this.chart1SelectedImageCharacteristicUnit);
              this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
              this.chart1IsActive=true;
            }).catch((error) => {
              //
              console.log(error);
            });
//        this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor, this.chart1SelectedParameter1Option).then((response) => {
//          return response;
//        }).then((data) => {
//          const chartData = TimeSeriesBuilderService.createImageCharacteristicTimeSeriesData(data);
//          const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName);
//          this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
//        });
      } else if (this.selectedChart1Sensor !== undefined && this.chart1SelectedParameter1Option !== undefined && this.chart1SelectedParameter2Option !== undefined) {
        // update image characteristic time series with parameter 1 & 2
          this.starsAPIService.fetchImageClassifiedTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor, this.chart1SelectedParameter1Option, this.chart1SelectedParameter2Option, this.fmusList, this.classesList).then((response) => {
              return response;
            }).then((data) => {
              const chartData = TimeSeriesBuilderService.createImageClassifiedTimeSeriesData(data,this.classesList);
              const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageCharacteristicName+' per bin', this.chart1SelectedImageCharacteristicName,this.chart1SelectedImageCharacteristicUnit);
              this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
              this.chart1IsActive=true;
            }).catch((error) => {
              //
              console.log(error);
            });
//        this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart2SelectedImageCharacteristicId, this.selectedChart2Sensor, this.chart2SelectedParameter1Option, this.chart2SelectedParameter2Option).then((response) => {
//          return response;
//        }).then((data) => {
//          const chartData = TimeSeriesBuilderService.createImageCharacteristicTimeSeriesData(data);
//          const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart2SelectedImageType, this.chart2SelectedImageCharacteristicName);
//          this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
//        });
      }
    } else if (this.chart1SelectedCharacteristicType === 'Field Characteristic') {
      // update field characteristic time series
        //console.log('updateTimeSeries');
        // Get The Group classes just like in the histogram data
        this.starsAPIService.fetchFieldClassifiedTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.chart1SelectedFieldCharacteristicId, this.cropList, this.fmusList, this.classesList).then((response) => {
            return response;
          }).then((data) => {
            const chartData = TimeSeriesBuilderService.createFieldClassifiedTimeSeriesData(data,this.classesList);
            const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedFieldCharacteristicName+' per bin', this.chart1SelectedFieldCharacteristicName,this.chart1SelectedFieldCharacteristicUnit);
            this.renderFieldCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
            this.chart1IsActive=true;
          }).catch((error) => {
            //
            console.log(error);
          });
      
    }
  }

  /**
   * For setting up the layout style when the charts load for the first time
   */
  initializeChartLayout() {
    const targetElementWidth = document.getElementById('classifiedTimeSeriesCard').offsetWidth;
    Plotly.relayout('classifiedChart1', { width: targetElementWidth });
  }

  /**
   * Utility for initializing the image characteristic options
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   */
  initializeImageCharacteristicsOptions(studyAreaId: number, startYear: number, endYear: number = undefined) {

    this.starsAPIService.fetchImageCharacteristics(studyAreaId, startYear, endYear).then((response) => {
      return response;
    }).then((data) => {
      this.allSpectralCharacteristicObjects = data.results.spectralCharacteristics;
      this.allTexturalCharacteristicObjects = data.results.texturalCharacteristics;
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Utility for initializing the field characteristic options
   * @param {number} studyAreaId
   * @param {number} startYear
   * @param {number} endYear
   */
  initializeFieldCharacteristicOptions(studyAreaId: number, startYear: number, endYear: number = undefined) {

    this.starsAPIService.fetchFieldCharacteristics(studyAreaId, startYear, endYear).then((response) => {
      return response;
    }).then((data) => {
      this.fieldTypes = data.results.fieldCharacteristics;
    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * Utility for rendering the image characteristics chart for the time series response.
   * @param {any} chartData
   * @param {any} chartLayout
   * @param {string} targetDivId
   */
  renderImageCharacteristicTimeSeriesChart(chartData: any, chartLayout: any, targetDivId: string) {
    Plotly.newPlot(targetDivId,
      chartData,
      chartLayout,
      {
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines'],
        displaylogo: false
      });
  }

  /**
   * Utility for rendering the field characteristics chart for the time series response.
   * @param {any[]} chartData
   * @param {string} chartLayout
   * @param {string} targetDivId
   */
  renderFieldCharacteristicTimeSeriesChart(chartData: any, chartLayout: any, targetDivId: string) {
    Plotly.newPlot(targetDivId,
      chartData,
      chartLayout,
      {
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines'],
        displaylogo: false
      });
  }

  /**
   * Handles when user choose a characteristic type for Chart 1.
   */
  onChart1CharacteristicTypeChange() {

    // clear down flowing drop downs & chart
    this.chart1SelectedImageType = undefined;
    this.chart1SelectedImageCharacteristicId = undefined;
    this.chart1SelectedImageCharacteristicName = undefined;
    this.selectedChart1Sensor = undefined;
    this.chart1Parameter1IsVisible = false;
    this.chart1Parameter1Name = undefined;
    this.chart1Parameter1Range = [];
    this.chart1SelectedParameter1Option = undefined;
    this.chart1Parameter2IsVisible = false;
    this.chart1Parameter2Name = undefined;
    this.chart1Parameter2Range = [];
    this.chart1SelectedParameter2Option = undefined;
    this.chart1SelectedFieldCharacteristicName = undefined;
    this.chart1SelectedFieldCharacteristicId = undefined;
    TimeSeriesBuilderService.createEmptyTimeSeriesChart(Plotly, 'classifiedChart1');
    this.chart1IsActive=false;

    // show/hide dropdowns based on chosen characteristic type
    if (this.chart1SelectedCharacteristicType === this.characteristicTypes[0]) {

      // show image characteristic drop down options
      this.chart1ImageOptionsAreVisible = true;

      // hide field characteristic drop down options
      this.chart1FieldOptionsAreVisible = false;
    } else {

      // hide image characteristic drop down options
      this.chart1ImageOptionsAreVisible = false;

      // show field characteristic drop down options
      this.chart1FieldOptionsAreVisible = true;
    }
  }

  /**
   * Handles when user chooses an image type for Chart 1.
   */
  onChart1ImageTypeChange() {

    // clear down flowing drop downs & chart
    this.chart1SelectedImageCharacteristicId = undefined;
    this.chart1SelectedImageCharacteristicName = undefined;
    this.selectedChart1Sensor = undefined;
    this.chart1Parameter1IsVisible = false;
    this.chart1Parameter1Name = undefined;
    this.chart1Parameter1Range = [];
    this.chart1SelectedParameter1Option = undefined;
    this.chart1Parameter2IsVisible = false;
    this.chart1Parameter2Name = undefined;
    this.chart1Parameter2Range = [];
    this.chart1SelectedParameter2Option = undefined;
    TimeSeriesBuilderService.createEmptyTimeSeriesChart(Plotly, 'classifiedChart1');
    this.chart1IsActive=false;

    // add image characteristic drop down items
    if (this.chart1SelectedImageType === 'Spectral') {
      this.chart1ImageCharacteristics = TimeSeriesBuilderService.createUniqueCharacteristicNames(this.allSpectralCharacteristicObjects);
    } else {
      this.chart1ImageCharacteristics = TimeSeriesBuilderService.createUniqueCharacteristicNames(this.allTexturalCharacteristicObjects);
    }
  }

  /**
   * Handles when user chooses an image characteristic for Chart 1.
   */
  onChart1ImageCharacteristicChange() {

    // clear down flowing drop downs & chart
    this.selectedChart1Sensor = undefined;
    this.chart1Parameter1IsVisible = false;
    this.chart1Parameter1Name = undefined;
    this.chart1Parameter1Range = [];
    this.chart1SelectedParameter1Option = undefined;
    this.chart1Parameter2IsVisible = false;
    this.chart1Parameter2Name = undefined;
    this.chart1Parameter2Range = [];
    this.chart1SelectedParameter2Option = undefined;
    TimeSeriesBuilderService.createEmptyTimeSeriesChart(Plotly, 'classifiedChart1');
    this.chart1IsActive=false;

    // add sensor drop down items
    if (this.chart1SelectedImageType === 'Spectral') {

      // load spectral sensor drop down options
      this.chart1Sensors = TimeSeriesBuilderService.fetchSensorsForImageCharacteristic(this.chart1SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart1SelectedImageCharacteristicId  = TimeSeriesBuilderService.fetchImageCharacteristicId(this.chart1SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);

      this.chart1SelectedImageCharacteristicUnit  = TimeSeriesBuilderService.fetchImageCharacteristicUnit(this.chart1SelectedImageCharacteristicName, this.allSpectralCharacteristicObjects);
    } else {

      //
      //console.log(this.allTexturalCharacteristicObjects);

      // load textural sensor drop down options
      this.chart1Sensors = TimeSeriesBuilderService.fetchSensorsForImageCharacteristic(this.chart1SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);

      // for fetching a time series after a sensor is chosen
      this.chart1SelectedImageCharacteristicId  = TimeSeriesBuilderService.fetchImageCharacteristicId(this.chart1SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);
      this.chart1SelectedImageCharacteristicUnit  = TimeSeriesBuilderService.fetchImageCharacteristicUnit(this.chart1SelectedImageCharacteristicName, this.allTexturalCharacteristicObjects);
    }

    //
    //console.log('the chosen image characteristic id: ', this.chart1SelectedImageCharacteristicId);
  }

  /**
   * Handles when a user chooses a sensor for Chart 1.
   */
  onChart1SensorChange() {

    // clear down flowing drop downs & chart
    this.chart1Parameter1IsVisible = false;
    this.chart1Parameter1Name = undefined;
    this.chart1Parameter1Range = [];
    this.chart1SelectedParameter1Option = undefined;
    this.chart1Parameter2IsVisible = false;
    this.chart1Parameter2Name = undefined;
    this.chart1Parameter2Range = [];
    this.chart1SelectedParameter2Option = undefined;
    TimeSeriesBuilderService.createEmptyTimeSeriesChart(Plotly, 'classifiedChart1');
    this.chart1IsActive=false;

    // check if chosen sensor will require additional parameters
    const parameters = TimeSeriesBuilderService.fetchParametersForImageCharacteristic(this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName, this.selectedChart1Sensor, this.allSpectralCharacteristicObjects, this.allTexturalCharacteristicObjects);
    if (parameters.length === 0) {

      // render the time series
        
        this.starsAPIService.fetchImageClassifiedTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor, this.chart1SelectedParameter1Option, this.chart1SelectedParameter2Option, this.fmusList, this.classesList).then((response) => {
            return response;
          }).then((data) => {
            const chartData = TimeSeriesBuilderService.createImageClassifiedTimeSeriesData(data,this.classesList);
            const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageCharacteristicName+' per bin', this.chart1SelectedImageCharacteristicName,this.chart1SelectedImageCharacteristicUnit);
            this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
            this.chart1IsActive=true;
          }).catch((error) => {
            //
            console.log(error);
          });
        
//      this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor).then((response) => {
//        return response;
//      }).then((data) => {
//
//        const chartData = TimeSeriesBuilderService.createImageCharacteristicTimeSeriesData(data);
//        const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName);
//        this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
//      });
    } else if (parameters.length > 0) {

      // present parameters - we cannot yet render the time series
      if (parameters.length === 1) {



        // handle selection visibility
        this.chart1Parameter1IsVisible = true;
        this.chart1Parameter2IsVisible = false;

        // present parameter 1 to user
        const parameter1 = parameters[0];
        this.chart1Parameter1Name = TimeSeriesBuilderService.fetchParameterName(parameter1);
        this.chart1Parameter1Range = TimeSeriesBuilderService.fetchParameterRange(parameter1);
      } else {



        // handle selection visibility
        this.chart1Parameter1IsVisible = true;
        this.chart1Parameter2IsVisible = true;

        // present parameter 1 to user
        const parameter1 = parameters[0];
        this.chart1Parameter1Name = TimeSeriesBuilderService.fetchParameterName(parameter1);
        this.chart1Parameter1Range = TimeSeriesBuilderService.fetchParameterRange(parameter1);

        // present parameter 2 to user
        const parameter2 = parameters[1];
        this.chart1Parameter2Name = TimeSeriesBuilderService.fetchParameterName(parameter2);
        this.chart1Parameter2Range = TimeSeriesBuilderService.fetchParameterRange(parameter2);
      }
    }
  }

  /**
   * Handles when a user chooses a parameter 1 option for Chart 1.
   */
  onChart1Parameter1Change() {

    // clear down flowing drop downs & chart
    this.chart1Parameter2IsVisible = false;
    this.chart1Parameter2Name = undefined;
    this.chart1Parameter2Range = [];
    this.chart1SelectedParameter2Option = undefined;
    TimeSeriesBuilderService.createEmptyTimeSeriesChart(Plotly, 'classifiedChart1');
    this.chart1IsActive=false;

    const parameters = TimeSeriesBuilderService.fetchParametersForImageCharacteristic(this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName, this.selectedChart1Sensor, this.allSpectralCharacteristicObjects, this.allTexturalCharacteristicObjects);
    if (parameters.length === 1) {

      // render the time series
        
        this.starsAPIService.fetchImageClassifiedTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor, this.chart1SelectedParameter1Option, this.chart1SelectedParameter2Option, this.fmusList, this.classesList).then((response) => {
            return response;
          }).then((data) => {
            const chartData = TimeSeriesBuilderService.createImageClassifiedTimeSeriesData(data,this.classesList);
            const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageCharacteristicName+' per bin', this.chart1SelectedImageCharacteristicName,this.chart1SelectedImageCharacteristicUnit);
            this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
            this.chart1IsActive=true;
          }).catch((error) => {
            //
            console.log(error);
          });
//      this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor, this.chart1SelectedParameter1Option).then((response) => {
//        return response;
//      }).then((data) => {
//        const chartData = TimeSeriesBuilderService.createImageCharacteristicTimeSeriesData(data);
//        const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName);
//        this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
//      });
    }
  }

  /**
   * Handles when a user chooses a parameter 2 option for Chart 1
   */
  onChart1Parameter2Change() {
    //
    //console.log('param1 name: ', this.chart1Parameter1Name, ' range: ', this.chart1Parameter1Range, ' selected: ',   this.chart1SelectedParameter1Option);
    //console.log('param2 name: ', this.chart1Parameter2Name, '  range: ', this.chart1Parameter2Range, ' selected: ',  this.chart1SelectedParameter2Option);

    const parameters = TimeSeriesBuilderService.fetchParametersForImageCharacteristic(this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName, this.selectedChart1Sensor, this.allSpectralCharacteristicObjects, this.allTexturalCharacteristicObjects);
    if (parameters.length === 2) {

      // render the time series
        this.starsAPIService.fetchImageClassifiedTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor, this.chart1SelectedParameter1Option, this.chart1SelectedParameter2Option, this.fmusList, this.classesList).then((response) => {
            return response;
          }).then((data) => {
            const chartData = TimeSeriesBuilderService.createImageClassifiedTimeSeriesData(data,this.classesList);
            const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageCharacteristicName+' per bin', this.chart1SelectedImageCharacteristicName,this.chart1SelectedImageCharacteristicUnit);
            this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
            this.chart1IsActive=true;
          }).catch((error) => {
            //
            console.log(error);
          });
//      this.starsAPIService.fetchImageCharacteristicTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, this.cropList, this.chart1SelectedImageCharacteristicId, this.selectedChart1Sensor, this.chart1SelectedParameter1Option, this.chart1SelectedParameter2Option).then((response) => {
//        return response;
//      }).then((data) => {
//        const chartData = TimeSeriesBuilderService.createImageCharacteristicTimeSeriesData(data);
//        const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedImageType, this.chart1SelectedImageCharacteristicName);
//        this.renderImageCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
//      });
    }
  }

  /**
   * Handles when a user chooses a field characteristic for Chart 1.
   */
  onChart1FieldCharacteristicChange() {
    // fetch the field characteristic id
    const targetFieldCharName = this.chart1SelectedFieldCharacteristicName;
    let fieldCharUnit: string = undefined;
    let fieldCharId: number = undefined;
    this.fieldTypes.forEach(function(item){
      if (item.alias === targetFieldCharName) {
        fieldCharId = item.oid;
        fieldCharUnit=item.unit;
      }
    });
    this.chart1SelectedFieldCharacteristicId = fieldCharId;
    this.chart1SelectedFieldCharacteristicUnit = fieldCharUnit;
    
    // Get The Group classes just like in the histogram data
    this.starsAPIService.fetchFieldClassifiedTimeSeries(this.studyArea['properties']['id'], this.startYear, this.endYear, fieldCharId, this.cropList, this.fmusList, this.classesList).then((response) => {
        return response;
      }).then((data) => {
        const chartData = TimeSeriesBuilderService.createFieldClassifiedTimeSeriesData(data,this.classesList);
        const chartLayout = TimeSeriesBuilderService.createTimeSeriesLayout(this.chart1SelectedFieldCharacteristicName+' per bin', this.chart1SelectedFieldCharacteristicName,this.chart1SelectedFieldCharacteristicUnit);
        this.renderFieldCharacteristicTimeSeriesChart(chartData, chartLayout, 'classifiedChart1');
        this.chart1IsActive=true;
      }).catch((error) => {
        //
        console.log(error);
      });

  }
}
