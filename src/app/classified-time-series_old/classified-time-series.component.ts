import { Component, OnInit,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AppConfiguration } from '../app-configuration';
import { StarsAPIService } from '../services/stars-api.service';
import { UserSelectionService } from '../services/user-selection.service';

declare const Plotly: any;

@Component({
  selector: 'app-classified-time-series',
  templateUrl: './classified-time-series.component.html',
  styleUrls: ['./classified-time-series.component.css']
})
export class ClassifiedTimeSeriesComponent implements OnInit, OnDestroy {

  /**
   * Properties
   */
  toolTipPosition = 'right';
  classifiedTimeSeriesToolTip = AppConfiguration.classifiedTimeSeriesToolTip;

  subscriptionToSelectedStudyArea: Subscription;
  studyArea: JSON;
  subscriptionToSelectedStartYear: Subscription;
  startYear: number;
  subscriptionToSelectedEndYear: Subscription;
  endYear: number;
  subscriptionToSelectedCropTypes: Subscription;
  cropTypes: string;
  subscriptionToGroupedTimeSeriesData: Subscription;
  groupedTimeSeriesData: any;

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

        /*
        // fetch field constant characteristics for drop down only after crops are chosen
        this.starsAPIService.fetchFieldConstantCharacteristic(this.studyArea['properties']['id'], this.startYear).then((response) => {
          return response;
        }).then((data) => {
          this.fieldConstantCharacteristics = data.results.fieldConstants;
        }).catch((error) => {
          console.log(error);
        });
        */
      }
    );
    
    // subscribe to the groupedTimeSeriesData
    this.subscriptionToGroupedTimeSeriesData = this.userSelectionService.groupedTimeSeriesData$.subscribe(
      groupedTimeSeriesData => {
          //console.log(groupedTimeSeriesData);
        this.groupedTimeSeriesData = groupedTimeSeriesData;
        this.createTestGraphs();
      }
    );

  }

  /**
   * Life-cycle hook after component is created.
   */
  ngOnInit() {

    //this.createTestGraphs();
  }
  /**
   * Lifecycle hook that is called when destroyed.
   */
  ngOnDestroy() {
    this.subscriptionToSelectedStudyArea.unsubscribe();
    this.subscriptionToSelectedStartYear.unsubscribe();
    this.subscriptionToSelectedEndYear.unsubscribe();
    this.subscriptionToSelectedCropTypes.unsubscribe();
    this.subscriptionToGroupedTimeSeriesData.unsubscribe();
  }
  /**
   * For handling when a user taps the info button for the classified section
   */
  handleInfoButtonTap() {
    console.log('show info for classified section...');
  }

  /**
   * Utility for creating test graphs
   */
  createTestGraphs() {
      
    
    // test sample
    const spectralLarge = {
      x: ['142d', '150d', '177d', '210d', '291d', '305d', '318d'],
      y: [0.172186501324177,
        0.164392687380314,
        0.233714044094086,
        0.511275425553322,
        0.459536194801331,
        0.328727185726166,
        0.305574923753738],
      mode: 'lines',
      name: 'Large Field',
      line: {
        color: '#ED7D31',
        width: 3
      }
    };

    const spectralMedium = {
      x: ['142d', '150d', '177d', '210d', '291d', '305d', '318d'],
      y: [0.159075021743774,
        0.159485226869583,
        0.230874255299568,
        0.430628561973572,
        0.437032335996628,
        0.301825460791588,
        0.274069619178772],
      mode: 'lines',
      name: 'Medium Field',
      line: {
        color: '#A6A6A6',
        width: 3
      }
    };

    const spectralSmall = {
      x: ['142d', '150d', '177d', '210d', '291d', '305d', '318d'],
      y: [0.166699558496475,
        0.169587473074595,
        0.209321816762288,
        0.458195855220159,
        0.513612816731135,
        0.34847895304362,
        0.288037200768789],
      mode: 'lines',
      name: 'Small Field',
      line: {
        color: '#0070C0',
        width: 3
      }
    };

    // layout for millet spectral test sample
    const milletSpectralLayout = {
      title: 'NDVI by field size class',
      xaxis: {
        title: 'Time',
        showgrid: true,
        zeroline: true
      },
      yaxis: {
        title: 'NDVI',
        showline: false
      },
      hovermode: 'closest'
    };

    // spectral chart for millet
    const milletSpectralData = [spectralLarge, spectralMedium, spectralSmall];
    Plotly.newPlot('classifiedChart1',
      milletSpectralData,
      milletSpectralLayout,
      {
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines']
      }
    );

    // data for millet textural vs size test sample
    const texturalLarge = {
      x: ['142d', '150d', '177d', '210d', '291d', '305d', '318d'],
      y: [0.415549235418439,
        0.374856048263609,
        0.351025509648025,
        0.303790537640452,
        0.224534968845546,
        0.228838828857988,
        0.189544670749456],
      mode: 'lines',
      name: 'Large Field',
      line: {
        color: '#ED7D31',
        width: 3
      }
    };

    const texturalMedium = {
      x: ['142d', '150d', '177d', '210d', '291d', '305d', '318d'],
      y: [0.463320282101631,
        0.536173478141427,
        0.337403660267591,
        0.27685378100723,
        0.218739508278668,
        0.222100229747593,
        0.20152266677469],
      mode: 'lines',
      name: 'Medium Field',
      line: {
        color: '#A6A6A6',
        width: 3
      }
    };

    const texturalSmall = {
      x: ['142d', '150d', '177d', '210d', '291d', '305d', '318d'],
      y: [0.432596058274309,
        0.374107008799911,
        0.356859012196461,
        0.333457679177324,
        0.246811929158866,
        0.233219016653796,
        0.213154709277054],
      mode: 'lines',
      name: 'Small Field',
      line: {
        color: '#0070C0',
        width: 3
      }
    };

    // layout for millet textural test sample
    const milletTexturalLayout = {
      title: 'Homogeneity by field size class',
      xaxis: {
        title: 'Time',
        showgrid: true,
        zeroline: true
      },
      yaxis: {
        title: 'Homogeneity',
        showline: false
      },
      hovermode: 'closest'
    };

    const milletTexturalData = [texturalLarge, texturalMedium, texturalSmall];
    Plotly.newPlot('classifiedChart2',
      milletTexturalData,
      milletTexturalLayout,
      {
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines']
      }
    );
  }
}
