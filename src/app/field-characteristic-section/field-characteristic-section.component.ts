import { Component, OnInit } from '@angular/core';

declare let Plotly: any;
declare var classyBrew: any;

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



    // testing classybrew

    var brew = new classyBrew();
    brew.setSeries([30.01, 14.9, 22.71, 24.96, 7.17, 15.2, 20.2, 30.4, 50.5, 70.9, 80.9, 90.1, 100]);
    brew.setNumClasses(3);
    brew.setColorCode("BuGn");

    brew.classify('jenks');

    var breaks = brew.getBreaks(); // returns [7.17,14.9,19.3,22.71,26.9,31.26]
    var colors = brew.getColors(); // returns [rgb(237,248,251),rgb(178,226,226),rgb(102,194,164),rgb(44,162,95),rgb(0,109,44)]
    brew.getColorInRange(7.5); // returns rgb(237,248,251)

    console.log(breaks);
    console.log(colors);

  }

  /**
   * For handling when a user taps the info button for field characteristics
   */
  handleInfoButtonTap() {
    console.log('show info for field characteristics')
  }
}
