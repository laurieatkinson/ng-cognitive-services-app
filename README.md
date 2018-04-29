# Angular Cognitive Services App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

## Add subscription keys and set API service URL

Edit environment.ts and provide the following from your Azure portal:

computerVision: 'guid-here',  
face: 'guid-here',  
textAnalytics: 'guid-here'
bingSpeech: 'guid-here'

apiServer is set to West Central. If your API services use different location(s), modify this URL

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

