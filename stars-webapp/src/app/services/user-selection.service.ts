import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UserSelectionService {

  // source study area
  private studyAreaSource = new Subject<any>();

  // observable study area
  studyArea$ = this.studyAreaSource.asObservable();

  /**
   * For changing the studyArea chosen by the user
   * @param studyArea
   */
  updateStudyArea(studyArea: any) {
    this.studyAreaSource.next(studyArea);
  }
}
