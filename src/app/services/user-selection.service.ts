import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserSelectionService {

  // source study area
  private studyAreaSource = new Subject<any>();
  // source start year
  private startYearSource = new Subject<number>();
  // source end year
  private endYearSource = new Subject<number>();
  // source crop types
  private cropTypesSource = new Subject<string[]>();
  // source group/classes data
  private classifiedFmuIDsSource = new Subject<any>();
  // source group/classes data
  private chart1TimeSeriesStatusSource = new Subject<any>();

  // observable study area
  studyArea$ = this.studyAreaSource.asObservable();
  // observable start year
  startYear$ = this.startYearSource.asObservable();
  // observable end year
  endYear$ = this.endYearSource.asObservable();
  // observable crop types
  cropTypes$ = this.cropTypesSource.asObservable();
  // observable crop types
  classifiedFmuIDs$ = this.classifiedFmuIDsSource.asObservable();
  // observable chart1SelectedCharacteristicType type
  chart1TimeSeriesStatus$ = this.chart1TimeSeriesStatusSource.asObservable();

  /**
   * For changing the study area chosen by the user.
   * @param studyArea
   */
  updateStudyArea(studyArea: any) {
    this.studyAreaSource.next(studyArea);
  }

  /**
   * For changing the start year chosen by the user.
   * @param startYear
   */
  updateStartYear(startYear: number) {
    this.startYearSource.next(startYear);
  }

  /**
   * For changing the end year chosen by the user.
   * @param endYear
   */
  updateEndYear(endYear: number) {
    this.endYearSource.next(endYear);
  }

  /**
   * For changing the crop types chosen by the user.
   * @param cropTypes
   */
  updateCropTypes(cropTypes: string[]) {
    this.cropTypesSource.next(cropTypes);
  }
  
  /**
   * For changing the data from 
   * @param groupedTimeSeriesData
   */
  updateClassifiedFmuIDs(classifiedFmuIDs: any,classifiedFmuColors:any) {
    this.classifiedFmuIDsSource.next({classifiedFmuIDs:classifiedFmuIDs,classifiedFmuColors:classifiedFmuColors});
  }
  
  /**
   * For changing the data from 
   * @param chart1SelectedCharacteristicType
   */
  updateChart1TimeSeriesStatus (
          active:boolean,
          chart1SelectedCharacteristicType:any,
          chart1SelectedImageType:any,
          chart1SelectedImageCharacteristicName:any,
          chart1SelectedImageCharacteristicId:any,
          chart1SelectedImageCharacteristicUnit:any,
          selectedChart1Sensor:any,
          chart1SelectedParameter1Option:any,
          chart1SelectedParameter2Option:any,
          chart1SelectedFieldCharacteristicName:any,
          chart1SelectedFieldCharacteristicId:any,
          chart1SelectedFieldCharacteristicUnit:any
          ) {
    this.chart1TimeSeriesStatusSource.next({
        active:active,
        chart1SelectedCharacteristicType:chart1SelectedCharacteristicType,
        chart1SelectedImageType:chart1SelectedImageType,
        chart1SelectedImageCharacteristicName:chart1SelectedImageCharacteristicName,
        chart1SelectedImageCharacteristicId:chart1SelectedImageCharacteristicId,
        chart1SelectedImageCharacteristicUnit:chart1SelectedImageCharacteristicUnit,
        selectedChart1Sensor:selectedChart1Sensor,
        chart1SelectedParameter1Option:chart1SelectedParameter1Option,
        chart1SelectedParameter2Option:chart1SelectedParameter2Option,
        chart1SelectedFieldCharacteristicName:chart1SelectedFieldCharacteristicName,
        chart1SelectedFieldCharacteristicId:chart1SelectedFieldCharacteristicId,
        chart1SelectedFieldCharacteristicUnit:chart1SelectedFieldCharacteristicUnit
        }); 
  }
  
}
