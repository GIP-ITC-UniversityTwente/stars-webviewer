import { Component, OnInit } from '@angular/core';

declare let Plotly: any;
declare var geostats: any;

@Component({
  selector: 'app-field-characteristic-section',
  templateUrl: './field-characteristic-section.component.html',
  styleUrls: ['./field-characteristic-section.component.css']
})
export class FieldCharacteristicSectionComponent implements OnInit {

  /**
   * Properties
   */
  selectedFieldCharacteristic: string = null;
  fieldCharacteristics: string[] = ["Field Size"];
  selectedClassificationMethod: string = null;
  classificationMethods: string[] = ["Jenks", "Equal Interval", "Quantile", "Unique Values", "Standard Deviation", "Arithmetic Progression", "Geometric Progression", ];
  selectedClassSize: number = null;
  classSizes: number[] = [1, 2, 3, 4, 5];

  /**
   * Component Life-cyle methods
   */
  constructor() { }

  ngOnInit() {

    // field based characteristic sample classification data
    let data = [
      {
        name: 'Medium Field',
        x: ['7000'],
        y: [2],
        type: 'bar',
        marker:{
          color: ['#A6A6A6']
        }
      },
      {
        name: 'Large Field',
        x: ['11000', '15000'],
        y: [3, 3],
        type: 'bar',
        marker: {
          color: ['#ED7D31', '#ED7D31']
        }
      }
      ,
      {
        name: 'Small Field',
        x: ['0', '23000', '27000'],
        y: [0, 1, 1],
        type: 'bar',
        marker: {
          color: ['#0070C0', '#0070C0', '#0070C0']
        }
      }
    ];

    let layout = {
      title: 'Histogram field size & classification',
      bargap :0.5,
      hovermode: 'closest'
    };

    Plotly.newPlot('histogram',
      data,
      layout,
      {
        displayModeBar: 'hover',
        modeBarButtonsToRemove: ['sendDataToCloud', 'zoom2d', 'select2d', 'lasso2d', 'resetScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines']
      }
    );

    // ----------------------------------------
    // testing geostats classification library
    // ----------------------------------------

    let series = new geostats([11.25, 11.25, 11.25, 15.25, 15.25, 15.25, 19.25, 19.25, 19.25, 30.25, 30.25, 30.25, 50.25, 50.25, 50.25]);
    series.setPrecision(2);
    let numberOfClasses = 5;

    //series.getClassJenks(numberOfClasses);
    //series.getClassGeometricProgression(numberOfClasses);
    series.getClassEqInterval(numberOfClasses);
    //series.getQuantile(numberOfClasses);
    //series.getClassStdDeviation(numberOfClasses);
    //series.getClassUniqueValues(numberOfClasses);
    //series.getClassArithmeticProgression(numberOfClasses);

    console.log('method: ' + series.method);
    console.log('ranges: ' + series.ranges);
    console.log('bounds: ' + series.bounds);
    console.log('inner ranges: ' + series.inner_ranges);
    console.log('colors: ' + series.colors);
    console.log('counter: ' + series.counter);
  }

  /**
   * For handling when a user taps the info button for field characteristics
   */
  handleInfoButtonTap() {
    console.log('show info for field characteristics')
  }
}
