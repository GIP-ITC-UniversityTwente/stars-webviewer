# STARS-WebViewer

Web interface of the Visualization tool for STARS

## Directory Structure

At the root of this repository are two directories:

* __api_request__ This directory contains artifacts related to communicating what API endpoints are reuqired by the STARS web viewer.  

* __stars_webapp__ This directory contains the source code for the STARS web viewer.


## Client-Side Technology

This aplication uses:

[__Angular__](https://github.com/angular/angular) 4.1.3 as the web framework.

[__Angular-CLI__](https://github.com/angular/angular-cli) 1.1.0 Command Line Interface for project build & project scaffolding.

[__Angular Material__](https://github.com/angular/material2) 2.0.0 for UI/UX goodness.

[__Angular Flexbox CSS__](https://github.com/angular/flex-layout) 2.0.0 as the responsive engine.

[__Plotly.js__](https://plot.ly/javascript/) 1.27.1 for Charts

## Running the App

To run this app, clone the repo, install node packages, and use the Angular-CLI to serve it up.  For example:

````
  npm install

  ng serve
````

## Build & Deploy the App

To build the web app, use Terminal to cd to the root folder of the web app on your workstation.  Then, use the Angular-CLI. 

````
  ng build --prod
````

Then deploy the contents of the __dist__ folder to the
web server bucket. 
