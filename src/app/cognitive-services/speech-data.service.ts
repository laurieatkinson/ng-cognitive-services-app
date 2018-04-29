import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType, Headers } from '@angular/http';
import { SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { DataService } from './data.service';
import { ISpeakerIdentity } from './models/speech.models';

@Injectable()
export class SpeechDataService extends DataService {

    private key = environment.apiKeys.bingSpeech;
    private bingSpeechSynthesizeAPI = 'https://speech.platform.bing.com/synthesize';
    private bingSpeechRecognizeAPI = 'https://speech.platform.bing.com/recognize';

    textToSpeech(text: string, locale: string, voiceName: string, gender: string): Promise<ArrayBuffer> {
        // https://docs.microsoft.com/en-us/azure/cognitive-services/Speech/api-reference-rest/bingvoiceoutput
        return new Promise<ArrayBuffer>((resolve, reject) => {
            this.getToken(this.key).then(token => {
                this.postSpeechData<ArrayBuffer>(this.bingSpeechSynthesizeAPI,
                    this.getSSML(text, locale, voiceName, gender),
                    this.key,
                    new Headers({
                        'Authorization': `Bearer ${token}`,
                        'X-Microsoft-OutputFormat': 'riff-8khz-8bit-mono-mulaw' // 'audio-16khz-32kbitrate-mono-mp3'
                    }))
                    .then(response => {
                        resolve(response);
                    });
            });
        });
    }

    getSSML(text: string, locale: string, voiceName: string, gender: string): string {
        return `<speak version='1.0' xml:lang='${locale}'>
                    <voice xml:lang='${locale}'
                        xml:gender='${gender}'
                        name='${voiceName}'>
                        ${text}
                    </voice>
                </speak>`;
    }

        // identify(audioFileUrl: string): Promise<ISpeakerIdentity> {
    //     const promise = new Promise<ISpeakerIdentity>((resolve, reject) => {
    //         this.get<ResponseContentType.ArrayBuffer>(audioFileUrl, null, ResponseContentType.ArrayBuffer)
    //             .then(audioFile => {
    //                 const identificationProfileIds = environment.speakerAudio.map(value => value.identificationProfileId).join(',');
    //                 // Identify who is speaking given a group of speakers.
    //                 const url = `${this.speechApiServer}/spid/v1.0/identify?identificationProfileIds=${identificationProfileIds}`;

    //                 this.postWithMore<ISpeakerIdentity>(url, audioFile, environment.apiKeys.speakerRecognition)
    //                     .then(speaker => {
    //                         resolve(speaker);
    //                     })
    //                     .catch(error => {
    //                         reject(error);
    //                     });
    //             });
    //     });
    //     return promise;
    // }

    // speechToText(blob: Blob, locale: string): Promise<any> {
    //     const url = `${this.bingSpeechRecognizeAPI}?scenarios=smd&appid=D4D52672-91D7-4C74-8AD8-42B1D98141A5' +
    //         '&locale=' + locale + '&device.os=osx&version=3.0&format=json&instanceid=49f5b418-fdf6-4987-9efb-705d9a438771' +
    //         '&requestid=888affe7-6e3f-480c-b2a8-4d2fe7989ad2`;
    //     return this.postAudioData(url, blob, this.key);
    // }

    // getAudioFile(url: string): Promise<ArrayBuffer> {
    //     return this.get<ArrayBuffer>(url, null, ResponseContentType.ArrayBuffer);
    // }
}
