import { Injectable } from '@angular/core';
import { User } from './user';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { catchError, tap, map } from 'rxjs/operators';

import { LocalCacheService } from '../local-cache/local-cache.service';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import { VehicleLocation } from './vehicle-location';
import { of, Observable, interval } from 'rxjs';

@Injectable()

export class UserService {
  
  baseUrl = environment.apiBasePath; // TODO: this should be changed to the Config service.
  private handleError: HandleError;
  isUserList = function (object: any): object is User[] {    
    return 'userid' in object[0];
  }
  isVehicleLocationList = function (object: any): object is VehicleLocation[] {    
    return 'vehicleid' in object[0];
  }

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
    private cache: LocalCacheService
  ) {
    this.handleError = httpErrorHandler.createHandleError('UserService');
  }

  getUserList() {
    let operation = 'getUserList';
    let value = this.cache.get(operation);
    if (value !== null && this.isUserList(value)) return of(value);

    let opts = new HttpParams().set('op', 'list');

    return this.http.get<User[]>(this.baseUrl, { params: opts })
      .pipe(
        map(response => response['data']),
        map((users: User[]) => users.filter(user => 'userid' in user)),
        tap(data => this.cache.add(operation, data, Date.now(), environment.userDataCachingTimeInSec)),
        catchError(this.handleError(operation))
      );
  }

  getUser(id: number | string) {
    let operation = 'getUser';
    return this.getUserList().pipe(      
      map((users: User[]) => users.find(user => user.userid === +id)),
      catchError(this.handleError(operation))
    );
  }

  getUserVehicleLocations(id: number) {    
    let operation = 'getUserVehicleLocations' + id;
    let value = this.cache.get(operation);
    console.log('cache value for locations', value);

    if (value !== null && this.isVehicleLocationList(value)) {
      return of(value);
    }

    let opts = new HttpParams().set('op', 'getlocations').append('userid', String(id));

    return this.http.get<VehicleLocation[]>(this.baseUrl, { params: opts })
      .pipe(
        map(response => response['data']),
        map((locations: VehicleLocation[]) => locations.filter(loc => 'vehicleid' in loc)),
        tap(data => this.cache.add(operation, data, Date.now(), environment.vehicleLocationDataCachingTimeInSec)),
        catchError(this.handleError(operation))
      );
  }  
}