import { Component, OnInit } from '@angular/core';

declare let Plotly: any;

@Component({
  selector: 'app-image-characteristic-section',
  templateUrl: './image-characteristic-section.component.html',
  styleUrls: ['./image-characteristic-section.component.css']
})
export class ImageCharacteristicSectionComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    //----------------------
    //  CHART 1 PLACEHOLDER
    //----------------------

    let milletSpectralLineEnvelope = {
      x: ['142d', '150d', '177d', '210d', '291d', '305d', '318d', '318d', '305d', '291d', '210d', '177d', '150d', '142d'],
      y: [0.15, 0.15, 0.2, 0.43, 0.44, 0.31, 0.27, 0.3, 0.34, 0.48, 0.48, 0.25, 0.19, 0.17],
      fill: "tozerox",
      fillcolor: "rgba(0, 100, 80, 0.2)",
      name: 'Millet Envelope',
      showlegend: false,
      type: "scatter",
      line: {color: "transparent"}
    };

    // data for millet spectral test sample
    let milletSpectralLine = {
      x: ['142d', '150d', '177d', '210d', '291d', '305d', '318d'],
      y: [0.163984678685665, 0.163497392833233, 0.224976481497288, 0.455028122663498, 0.464507251977921, 0.321201853454113, 0.28456095457077],
      mode: 'lines',
      name: 'Millet',
      line: {
        color: '#6A7F00',
        width: 3
      },
      type: "scatter"
    };

    // layout for millet spectral test sample
    let milletSpectralLayout = {
      title: "Spectral Time Series",
      xaxis: {
        title: 'Time',
        showgrid: true,
        zeroline: true,
        ticks: "outside",
        showticklabels: true
      },
      yaxis: {
        title: 'NDVI',
        showline: false,
        ticks: "outside",
        showticklabels: true
      }
    };

    // spectral chart for millet
    let milletSpectralData = [milletSpectralLineEnvelope, milletSpectralLine];
    Plotly.newPlot('ndviChart', milletSpectralData, milletSpectralLayout);

    //----------------------
    //  CHART 2 PLACEHOLDER
    //----------------------

    // data for millet textural test sample
    let milletTexturalLine = {
      x: ['142d', '150d', '177d', '210d', '291d', '305d', '318d'],
      y: [0.429646278731525, 0.471472800523043, 0.353645605966449, 0.313254946377128, 0.240355986077338, 0.235981020890176, 0.218380955606699],
      mode: 'lines',
      name: 'Maize',
      line: {
        color: '#2673A8',
        width: 3
      }
    };

    // layout for millet textural test sample
    let milletTexturalLayout = {
      title: "Textural Time Series",
      xaxis: {
        title: 'Time',
        showgrid: true,
        zeroline: true
      },
      yaxis: {
        title: 'Homogeneity',
        showline: false
      }
    };

    let milletTexturalData = [milletTexturalLine];
    Plotly.newPlot('texturalChart', milletTexturalData, milletTexturalLayout);
  }
}
