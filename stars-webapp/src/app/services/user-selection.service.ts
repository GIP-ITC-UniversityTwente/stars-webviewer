import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserSelectionService {

  // source study area
  private studyAreaSource = new Subject<JSON>();
  // source start year
  private startYearSource = new Subject<number>();

  // observable study area
  studyArea$ = this.studyAreaSource.asObservable();
  // observable start year
  startYear$ = this.startYearSource.asObservable();

  /**
   * For changing the study area chosen by the user
   * @param studyArea
   */
  updateStudyArea(studyArea: JSON) {
    this.studyAreaSource.next(studyArea);
  }

  /**
   * For changing the start year chosen by the user
   * @param startYear
   */
  updateStartYear(startYear:  number) {
    this.startYearSource.next(startYear);
  }
}
