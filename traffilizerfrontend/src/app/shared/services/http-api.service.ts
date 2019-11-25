import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
// Import the map operator
import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {
  urlPath: string = environment.production ? 'https://service.traffilizer.com/' : 'http://localhost:53535/';
  
  constructor(private _http: Http, private router: Router) { }

  anonymousPost(url: string, data: any): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(this.urlPath + url, data, options)
      .map(this.HandleMapObservable)
      .catch((error: Response) => this.handleErrorObservable(error, this.router));
  }

  masterGet(url: string): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + localStorage.getItem('userToken')
    });
    let options = new RequestOptions({ headers: headers });
    return this._http.get(this.urlPath + url, options)
      .map(this.HandleMapObservable)
      .catch((error: Response) => this.handleErrorObservable(error, this.router));
  }

  masterPost(url: string, data: any): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + localStorage.getItem('userToken')
    });
    let options = new RequestOptions({ headers: headers });
    return this._http.post(this.urlPath + url, data, options)
      .map(this.HandleMapObservable)
      .catch((error: Response) => this.handleErrorObservable(error, this.router));
  }

  masterPut(url: string, data: any): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': 'Bearer ' + localStorage.getItem('userToken')
    });
    let options = new RequestOptions({ headers: headers });
    return this._http.put(this.urlPath + url, data, options)
      .map(this.HandleMapObservable)
      .catch((error: Response) => this.handleErrorObservable(error, this.router));
  }

  private HandleMapObservable(response: Response | any) {
    if (response.text()) {
      return response.json();
    }
  }

  private handleErrorObservable(error: Response | any, router: Router) {
    if (error.statusText == 'Unauthorized') {
      router.navigate(["/sign-in"]);
    }
    console.error(error.message || error);
    return Observable.throw(error.message || error);
  }

}
