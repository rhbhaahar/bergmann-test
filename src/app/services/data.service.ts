import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  constructor(private http: HttpClient) { }

  public getWeather = (params: {start_date: string, end_date: string}, sensorType: string): Observable<any> => {
    // selected city is Berlin
    const defaultParams = {
      latitude: 52.5244,
      longitude: 13.4105,
      daily: sensorType
    }

    return this.http.get('https://archive-api.open-meteo.com/v1/archive', { params: { ...defaultParams, ...params } })
  }
}
