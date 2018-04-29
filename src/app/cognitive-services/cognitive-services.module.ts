import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { DataService } from './data.service';
import { FaceDataService } from './face-data.service';
import { VisionDataService } from './vision-data.service';
import { TextDataService } from './text-data.service';
import { SpeechDataService } from './speech-data.service';

@NgModule({
  imports: [
    HttpModule
  ],
  providers: [
      DataService,
      FaceDataService,
      VisionDataService,
      TextDataService,
      SpeechDataService
  ]
})
export class CognitiveServicesModule { }
