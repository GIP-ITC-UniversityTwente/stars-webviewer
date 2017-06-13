import { Component, OnInit } from '@angular/core';

declare let Plotly: any;

@Component({
  selector: 'app-field-characteristic-section',
  templateUrl: './field-characteristic-section.component.html',
  styleUrls: ['./field-characteristic-section.component.css']
})
export class FieldCharacteristicSectionComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // field based characteristic sample histogram data
    /*
    let x = [4934.71018645975,
      5906.2579128693,
      8095.02343501385,
      10120.3453651254,
      10144.8072700207,
      11606.8924657987,
      12260.7424760228,
      13761.5447946843,
      19672.9027281591,
      26305.6291728029];

    let data = [
      {
        x: x,
        type: 'histogram',
        marker: {
          color: '#ED7D31',
        },
      }
    ];
    let layout = {
      bargap: 0.5,
      bargroupgap: 0.5,
      barmode: "overlay",
      title: "Histogram",
      xaxis: {title: "Value"},
      yaxis: {title: "Count"}
    };
    Plotly.newPlot('histogram', data, layout);
    */

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
      bargap :0.5
    };

    Plotly.newPlot('histogram', data, layout);
  }
}
