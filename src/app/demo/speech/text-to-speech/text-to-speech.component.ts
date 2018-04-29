import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SpeechDataService } from '../../../cognitive-services/speech-data.service';
import { CognitiveServicesComponent } from '../../cognitive-services.component';
import { VoiceOptions } from '../../../cognitive-services/models/speech.models';

@Component({
  selector: 'app-speech-to-text',
  templateUrl: './text-to-speech.component.html',
  styleUrls: ['./text-to-speech.component.css']
})
export class TextToSpeechComponent extends CognitiveServicesComponent implements OnInit {
  apiTitle = 'Speech API';
  listening = false;
  apiDescription = 'Convert audio to text, understand intent, and convert text back to speech for natural responsiveness.';
  recognizedText = '';
  audioContext: AudioContext;
  audioSource: AudioBufferSourceNode;
  voiceOptions = VoiceOptions;
  voiceOptionKeys = Object.keys(VoiceOptions);
  textToSpeechLocale = 'en-US';
  textToSpeechVoice = VoiceOptions[this.textToSpeechLocale].voices[0].fullName;
  textToSpeechText = VoiceOptions[this.textToSpeechLocale].greeting;
  textToSpeechSSML = '';
  voiceProcessing = false;

  constructor(private titleService: Title, private speechDataService: SpeechDataService, private changeDetectorRef: ChangeDetectorRef) {
      super();
      this.titleService.setTitle('Speech API');
  }

  ngOnInit() {
      try {
          window['AudioContext'] = <AudioContext>(window['AudioContext'] || window['webkitAudioContext']);
          this.audioContext = new AudioContext;
      } catch (e) {
          this.errorMessage = 'No web audio support in this browser!';
      }
  }

  localeSelected() {
    this.textToSpeechVoice = this.voiceOptions[this.textToSpeechLocale].voices[0].fullName;
    this.textToSpeechText = this.voiceOptions[this.textToSpeechLocale].greeting;
    this.generateSSML();
  }

  playVoice() {
      this.voiceProcessing = true;
      const voiceProfile = this.voiceOptions[this.textToSpeechLocale].voices.find(v =>
        v.fullName === this.textToSpeechVoice);
      this.speechDataService.textToSpeech(this.textToSpeechText, this.textToSpeechLocale,
        voiceProfile.fullName, voiceProfile.gender)
          .then(result => {
            this.playFile(result);
          })
          .catch(() => {
            console.log('voice failed');
          });
  }

  // playSample() {
  //     this.speechDataService.getAudioFile('assets/sounds/speech-sample.wav').then((data: ArrayBuffer) => {
  //         this.playFile(data);
  //     })
  //     .catch(error => {
  //       console.log('file failed');
  //     });
  // }

  private generateSSML() {
    const voiceProfile = this.voiceOptions[this.textToSpeechLocale].voices.find(v =>
      v.fullName === this.textToSpeechVoice);
    this.textToSpeechSSML = this.speechDataService.getSSML(
      this.textToSpeechText, this.textToSpeechLocale, voiceProfile.fullName, voiceProfile.gender);
  }

  private playFile(data: ArrayBuffer) {
    this.audioContext.decodeAudioData(data)
      .then(decodedData => {
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = decodedData;
        this.audioSource.connect(this.audioContext.destination);
        this.audioSource.start(0);
     });
  }
}
