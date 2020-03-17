import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersModule } from './users/users.module';
import { HttpErrorHandler } from './http-error-handler.service';
import { LocalCacheService } from './local-cache/local-cache.service';
import { GeocodingService } from './geocoding.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    UsersModule,
    AppRoutingModule
  ],
  providers: [    
    GeocodingService,
    HttpErrorHandler,
    LocalCacheService    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
