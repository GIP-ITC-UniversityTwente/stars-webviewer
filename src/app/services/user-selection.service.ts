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
  private groupedTimeSeriesDataSource = new Subject<any>();

  // observable study area
  studyArea$ = this.studyAreaSource.asObservable();
  // observable start year
  startYear$ = this.startYearSource.asObservable();
  // observable end year
  endYear$ = this.endYearSource.asObservable();
  // observable crop types
  cropTypes$ = this.cropTypesSource.asObservable();
  // observable crop types
  groupedTimeSeriesData$ = this.groupedTimeSeriesDataSource.asObservable();

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
  updateGroupedTimeSeriesData(groupedTimeSeriesData: any) {
    this.groupedTimeSeriesDataSource.next(groupedTimeSeriesData);
  }
  
}
