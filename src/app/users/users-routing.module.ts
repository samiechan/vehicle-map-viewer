import { NgModule, Injectable } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { UserVehicleListComponent } from './user-vehicle-list/user-vehicle-list.component';
import { UserService } from './user.service';
import { Observable, empty, interval, timer } from 'rxjs';
import { VehicleLocation } from './vehicle-location';
import { catchError } from 'rxjs/operators';
import { User } from './user';

@Injectable()
export class VehicleLocationListResolver implements Resolve<VehicleLocation[]> {
  constructor(private service: UserService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User[]>|Promise<any>|any {
    return this.service.getUserVehicleLocations(+route.paramMap.get('id')).pipe(        
        catchError((error) => {
        console.log(error);
        return empty();
      }));
    } 
}

@Injectable()
export class UserResolver implements Resolve<User> {
  constructor(private service: UserService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any>|Promise<any>|any {
    return this.service.getUser(+route.paramMap.get('id')).pipe(
        catchError((error) => {
        console.log(error);
        return empty();
      }));
    } 
}

const routes: Routes = [
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'user/:id',
    component: UserVehicleListComponent,
    resolve: {
      locations: VehicleLocationListResolver,
      user: UserResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],   
  exports: [RouterModule]
})
export class UsersRoutingModule { }
