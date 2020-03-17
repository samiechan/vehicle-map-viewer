import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';

/** Type of the handleError function returned by HttpErrorHandler.createHandleError */
export type HandleError =
  <T> (operation?: string) => (error: HttpErrorResponse) => Observable<T>;

@Injectable()
  
export class HttpErrorHandler {

  constructor() { }

  createHandleError = (serviceName = '') => 
    (operation = 'operation') => this.handleError(serviceName, operation);

  handleError(serviceName = '', operation = 'operation') {

    return (error: HttpErrorResponse) => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      const message = (error.error instanceof ErrorEvent) ?
        error.error.message :
       `server returned code ${error.status} with body "${error.error}"`;
       console.log(message);

       // TODO: better job of transforming error for user consumption
       // TODO: let the app keep running by returning a safe result
      return throwError(`${serviceName}: ${operation} failed: ${message}`);
    };

  }
}
