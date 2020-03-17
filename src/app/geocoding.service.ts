import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class GeocodingService {

  constructor(
    private http: HttpClient
  ) {} 

    reverseGeocoding(lat: number, lon: number) {      
      let baseUrl = environment.geocodingServiceAPI; // TODO: this should be changed to the Config service.
      let opts = new HttpParams().set('format', 'json').append('lon', String(lon)).append('lat', String(lat))
      return this.http.get(baseUrl, { params: opts });
  }
}
