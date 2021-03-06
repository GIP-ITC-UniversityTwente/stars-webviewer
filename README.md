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

[__Auth0__](https://auth0.com) is used for the identify store.  The Auth0 hosted login page is also used for sign in, sign up, password recovery, and logging out.  Below are notes on the server and client configuration.

* In the Auth0 console, rhe following changes are made in console > Clients  
	* Create 'STARS Web Viewer' client app
	* In console > Clients > Settings,  the __Domain__ is added to the authConfig.ts file.
	* In console > Clients > Settings, the __Client ID__ is added to the authConfig.ts file.
	* In console > Clients > Settings > Advanced Settings, the OAuth Json Web Token Signature Algorithm needs to be changed to RS256.

* In the Auth0 console, we customize the color and logo for the login page by doing the following: 
	* In console > Hosted Pages > Login - turn on 'Customize Login Page'.
	* In the __theme__ property, change the logo and primaryColor properties.

* In the Auth0 console, we customize the theme for the Password Reset hosted page by doing the following:
	* In console > Hosted Pages > Password Reset - turn on 'Customize Password Reset Page'
	* In the __theme__ property, change the logo and color.

* In the Auth0 console, note that e-mails can be customized too (verification, password reset, etc.) this was not performed but can be authored by STARS staff.

* The development patterns used in the STARS Web Viewer for user authentication can be found in the following resources:
	* [Angular 2+ Login](https://manage.auth0.com/#/clients/4Q4AvhUTyB0rePqjOKhRaMb5yIYHxXSQ/quickstart)
	* [Auth0 Angular Login](https://github.com/auth0-samples/auth0-angular-samples/tree/master/01-Login)

## Coding Style, Syntax & Semantics

The coding style used in the STARS WebViewer is inspired by the following:

* The [Angular Style Guide](https://angular.io/guide/styleguide)
* The [TSLint rules](https://palantir.github.io/tslint/rules/)

## Running the App

To run this app, clone the repo, install node packages, and use the Angular-CLI to serve it up.  For example:

````
  npm install

  ng serve
````

## Build & Deploy the App

First, go to authConfig.ts file.  Change the __callback url__ property to watch the URL of the server.  Note that localhost is used for development.

````
interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: '4Q4AvhUTyB0rePqjOKhRaMb5yIYHxXSQ', // see dashboard > clients >  app > settings
  domain: 'ccabanerospatialdev.auth0.com',      // see dashboard > clients >  app > settings
  callbackURL: 'http://localhost:4200/callback' // <--- CHANGE HERE!!!
};

````

To build the web app, use Terminal to cd to the root folder of the web app on your workstation.  Then, use the Angular-CLI. 


````
  ng build --prod
````

Then deploy the contents of the __dist__ folder to the
web server bucket. 
