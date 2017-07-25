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
  selectedClassificationMethod: string;
  classificationMethods: string[] = [];
  selectedClassSize: number;
  classSizes: number[] = [1, 2, 3, 4, 5];
  frequencyData: number[] = [];
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

  /**
   * Life-cycle hook after component is created.
   */
  ngOnInit() {

    HistogramBuilderService.createTestHistogram(Plotly);
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
    this.starsAPIService.fetchFieldConstantData(this.studyArea['properties']['id'], this.startYear, this.endYear, this.selectedFieldConstantCharacteristicId, this.cropTypes).then((response) => {
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
        const histoData = HistogramBuilderService.createUnclassifiedHistogramDataObject(this.frequencyData);
        this.presentHistogramData(histoData, false);
      } else {

        // create a classified histogram
        const histoData = HistogramBuilderService.createClassifiedHistogramDataObject(this.frequencyData, this.selectedClassificationMethod, this.selectedClassSize, this.geostatSeries);
        this.presentHistogramData(histoData, true);
      }

    }).catch((error) => {
      console.log(error);
    });
  }

  /**
   * For handling when a user changes the number of classes when viewing the frequency data.
   */
  onClassSizeChange() {

    if (this.classificationMethods.length !== HistogramBuilderService.classificationMethods.length) {
      this.classificationMethods = HistogramBuilderService.classificationMethods;
    }
  }

  /**
   * For handling when a user changes the target classification when viewing the frequency data.
   */
  onClassificationChange() {

    // create classified histogram
    const histoData = HistogramBuilderService.createClassifiedHistogramDataObject(this.frequencyData, this.selectedClassificationMethod, this.selectedClassSize, this.geostatSeries);
    this.presentHistogramData(histoData, true);
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
   */
  presentHistogramData(histogramData: any, isShowing: boolean) {

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
}

