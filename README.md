# STARS-WebViewer

Web interface of the Visualization tool for STARS


## Client-Side Technology

This aplication uses:

[__Angular__](https://github.com/angular/angular) 4.1.3 as the web framework.

[__Angular-CLI__](https://github.com/angular/angular-cli) 1.1.0 Command Line Interface for project build & project scaffolding.  Note, this requires Node 6.9.0 or higher and NPM 3 or higher.

[__Angular Material__](https://github.com/angular/material2) 2.0.0 for UI/UX goodness.

* Steps for project integration can be viewed [__here__](https://github.com/angular/material2/blob/master/guides/getting-started.md)

[__Angular Flexbox CSS__](https://github.com/angular/flex-layout) 2.0.0 as the responsive engine.

* Steps for project integration can be viewed [__here__](https://github.com/angular/flex-layout/wiki/Fast-Starts).  See the NPM Install steps at the top.

[__Plotly.js__](https://plot.ly/javascript/) 1.27.1 for Charts

* Added to the index.html.

[__Open Layers__](https://openlayers.org/) 4.2.0 for the Map interface.

* Added to the index.html.

[__geostats__](https://github.com/simogeo/geostats) 1.6.0 for client-side histogram classification.

* Being a small utility library that is added to this project as a local .js file. The steps for integration included:
	* Adding the .js file to src/assets/scripts folder
	* Referencing in index.js

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
