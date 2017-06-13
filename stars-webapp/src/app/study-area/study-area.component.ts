import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-study-area',
  templateUrl: './study-area.component.html',
  styleUrls: ['./study-area.component.css']
})
export class StudyAreaComponent implements OnInit {

  /**
    Properties
   */

  selectedStudyArea = "";
  studyAreas = [
    {value: 'studyArea1', viewValue: 'Study Area 1'},
    {value: 'studyArea2', viewValue: 'Study Area 2'},
    {value: 'studyArea3', viewValue: 'Study Area 3'}
  ];

  selectedCrop = "";
  cropTypes = [
    {value: 'cropType1', viewValue: 'Crop Type 1'},
    {value: 'cropType2', viewValue: 'Crop Type 2'},
    {value: 'cropType3', viewValue: 'Crop Type 3'}
  ];

  selectedStartYear = "";
  startYears = [
    {value: '2017', viewValue: '2017'},
    {value: '2016', viewValue: '2016'},
    {value: '2015', viewValue: '2015'},
    {value: '2014', viewValue: '2014'}
  ];

  selectedEndYear = "";
  endYears = [
    {value: '2017', viewValue: '2017'},
    {value: '2016', viewValue: '2016'},
    {value: '2015', viewValue: '2015'},
    {value: '2014', viewValue: '2014'}
  ];

  /**
   * Component Life-cycle Methods
   */
  constructor() { }

  ngOnInit() { }
}
