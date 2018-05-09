import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, ResponseContentType, ResponseType } from '@angular/http';
import { environment } from '../../environments/environment';

interface IRequestOptions {
    responseType: ResponseContentType;
    headers: Headers;
}

@Injectable()
export class DataService {

    protected apiServer = environment.apiServer;
    constructor(protected http: Http) {
    }

    get<T>(url: string, key?: string,
           responseType: ResponseContentType.Json | ResponseContentType.ArrayBuffer | ResponseContentType.Blob = ResponseContentType.Json) {
        const promise = new Promise<T>((resolve, reject) => {
            let options: IRequestOptions = null;
            if (key || responseType !== ResponseContentType.Json) {
                options = this.setRequestOptions(key, false, responseType);
            }
            return this.http.get(url, <any>options).toPromise()
                .then((response: Response) => {
                    if (responseType === ResponseContentType.Json) {
                        resolve(<T>response.json());
                    } else if (responseType === ResponseContentType.ArrayBuffer) {
                        resolve(<T>(<any>response)._body); // .arrayBuffer());
                    } else if (responseType === ResponseContentType.Blob) {
                        resolve(<T><any>response.blob());
                    }
                })
                .catch((reason: any) => {
                    const errMsg = this.logError(reason);
                    reject(errMsg);
                });
        });
        return promise;
    }

    getToken(key: string): Promise<string> {
        return this.postTextData<string>('https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
            null, key, ResponseContentType.Text);
    }

    postTextData<T>(url: string, body: string, key: string, responseType = ResponseContentType.Json) {
        const promise = new Promise<T>((resolve, reject) => {
            const options = this.setRequestOptions(key, true, responseType, 'text');
            return this._post<T>(url, body, options, resolve, reject);
        });
        return promise;
    }

    postSpeechData<T>(url: string, body: string, key: string, extraHeaders?: Headers) {
        const promise = new Promise<T>((resolve, reject) => {
            const options = this.setRequestOptions(key, true, ResponseContentType.ArrayBuffer, 'audio', extraHeaders);
            return this._post<T>(url, body, options, resolve, reject);
        });
        return promise;
    }

    postFormData<T>(url: string, body: string, key: string, responseType = ResponseContentType.Json,
            extraHeaders?: Headers) {
        const promise = new Promise<T>((resolve, reject) => {
            const options = this.setRequestOptions(key, true, responseType, 'form', extraHeaders);
            return this._post<T>(url, body, options, resolve, reject);
        });
        return promise;
    }

    postBinaryData<T>(url: string, body: ArrayBuffer, key: string, responseType = ResponseContentType.Json) {
        const promise = new Promise<T>((resolve, reject) => {
            const options = this.setRequestOptions(key, true, responseType, 'binary');
            return this._post<T>(url, body, options, resolve, reject);
        });
        return promise;
    }

    post<T>(url: string, body: any, key: string, responseType = ResponseContentType.Json) {
        const promise = new Promise<T>((resolve, reject) => {
            const options = this.setRequestOptions(key, true, responseType);
            return this._post<T>(url, body, options, resolve, reject);
        });
        return promise;
    }

    postWithMore<T>(url: string, body: any, key: string) {
        const options = this.setRequestOptions(key, true);

        const promise = new Promise<T>((resolve, reject) => {
            this.http.post(url, body, options).toPromise()
                .then((response: Response) => {
                    if (response.status === 202) {
                        const operationLocation = response.headers.get('Operation-Location');
                        if (!operationLocation) {
                            reject('No Operation-Location header found');
                        }
                        const interval = setInterval(() => {
                            this.http.get(operationLocation, options).toPromise()
                                .then((response2: Response) => {
                                    const operationResult = <{ status: string, processingResult: any }>response2.json();
                                    if (operationResult.status === 'Succeeded') {
                                        clearInterval(interval);
                                        resolve(<T>JSON.parse(operationResult.processingResult));
                                    }
                                })
                                .catch((reason: any) => {
                                    const errMsg = this.logError(reason);
                                    clearInterval(interval);
                                    reject(errMsg);
                                });
                        }, 5000);
                    } else {
                        resolve(<T>response.json());
                    }
                })
                .catch((reason: any) => {
                    const errMsg = this.logError(reason);
                    reject(errMsg);
                });
        });
        return promise;
    }

    private _post<T>(url: string, body: ArrayBuffer | string | Blob, options: IRequestOptions, resolve: Function, reject: Function) {
        return this.http.post(url, body, options).toPromise()
            .then((response: Response) => {
                const contentType = response.headers.get('Content-Type');
                if (contentType.indexOf('json') > -1) {
                    resolve(<T>response.json());
                } else if (contentType.indexOf('application/jwt') > -1) {
                    resolve((<any>response)._body);
                } else if (options.responseType === ResponseContentType.ArrayBuffer) {
                    resolve(response.arrayBuffer());
                } else {
                    const data = new Uint8Array(response.arrayBuffer());
                    const blob = <any>new Blob([data], { type: contentType });
                    resolve(<T>blob);
                }
            })
            .catch((reason: any) => {
                const errMsg = this.logError(reason);
                reject(errMsg);
            });
    }

    private setRequestOptions(key: string, post: boolean,
            responseContentType = ResponseContentType.Json,
            contentType: 'binary' | 'text' | 'form' | 'audio' | 'json' = 'json',
            extraHeaders?: Headers) {
        let headersSet = false;
        const headers = extraHeaders ? extraHeaders : new Headers();
        if (post) {
            switch (contentType) {
                case 'binary':
                    headers.append('Content-Type', 'application/octet-stream');
                    break;
                case 'text':
                    headers.append('Content-Type', 'text/plain');
                    break;
                case 'form':
                    headers.append('Content-Type', 'application/x-www-form-urlencoded');
                    break;
                case 'audio':
                    headers.append('Content-Type', 'application/ssml+xml');
                    break;
                default:
                    headers.append('Content-Type', 'application/json');
            }
            headersSet = true;
        } else {
            if (responseContentType === ResponseContentType.ArrayBuffer) {
                headersSet = true;
            }
        }
        if (key) {
            headers.append('Ocp-Apim-Subscription-Key', key);
            headersSet = true;
        }

        return headersSet ? {
            responseType: responseContentType,
            headers: headers
        } : null;
    }

    private logError(error: any) {
        const errMsg = error.message ? error.message :
            error._body && error._body.code ? `${error._body.code} - ${error._body.message}` :
                error._body && error._body.error ? `${error._body.error.code} - ${error._body.error.message}` :
                    error.status ? `${error.status} - ${error.statusText}` : 'Error calling API';
        console.log(error);
        return errMsg;
    }

    // postAudioData<T>(url: string, body: Blob, key: string, responseType = ResponseContentType.Json) {
    //     const promise = new Promise<T>((resolve, reject) => {
    //         const options = this.setRequestOptions(key, true, responseType, 'audio');
    //         return this._post<T>(url, body, options, resolve, reject);
    //     });
    //     return promise;
    // }
}
