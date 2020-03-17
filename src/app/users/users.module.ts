import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { UsersRoutingModule, VehicleLocationListResolver, UserResolver } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserVehicleListComponent } from './user-vehicle-list/user-vehicle-list.component';
import { UserService } from './user.service';


@NgModule({
  declarations: [UserListComponent, UserVehicleListComponent],
  imports: [
    CommonModule,    
    UsersRoutingModule
  ],
  providers: [
    UserService,    
    VehicleLocationListResolver,
    UserResolver
  ]
})
export class UsersModule { }
