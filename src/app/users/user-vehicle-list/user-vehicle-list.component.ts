import { Component, OnInit, AfterViewInit, Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../user.service';
import { User } from '../user';
import { VehicleLocation } from '../vehicle-location';
import * as L from 'leaflet';
import { GeocodingService } from 'src/app/geocoding.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-user-vehicle-list',
  templateUrl: './user-vehicle-list.component.html',
  styleUrls: ['./user-vehicle-list.component.scss']  
})

// TODO: Separate map component and list componenet..
@Injectable()
export class UserVehicleListComponent implements OnInit, AfterViewInit {    
  id: number;
  user: User;
  locations: VehicleLocation[];
  selectedVehicleId : number;
  userDataError: any;
  private map: any;
  private markers = {};  

  constructor( 
    private route: ActivatedRoute,   
    private router: Router,
    private geoService: GeocodingService
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id');   
    this.route.data.subscribe((data: {locations: any, user: any}) => {      
      this.locations = data.locations;
      this.user = data.user;
    })
  }

  ngAfterViewInit(): void {
    this.createMap();
  }

  // Navigate back to the user list view
  gotoUserList() {
    this.router.navigate(['/users']);
  }

  private createMap() {
    this.map = L.map('map', {
      // TODO: Get center coordinates
      center: [ 56.954, 24.109 ],
      zoom: 3
    });

    // TODO: Move to config file
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    if (this.locations && this.user?.vehicles) {      
      this.addMarkers(); // add interval
    }    
  }

  private async addMarkers() {            
    for (var location of this.locations) {
      // Skip location if coordiantes are not defined/null
      if (location.lat == null || location.lon == null) continue;
      
      var result = await this.geoService.reverseGeocoding(location.lat, location.lon).toPromise() as any;      
      
      var vehicle = this.user.vehicles.filter(v => v.vehicleid === location.vehicleid)[0];
      var color = vehicle?.color ?? "#000000";
      // Custom pin icon using font-awesome
      var icon = L.divIcon({
        className: '',
        html: `<div style="color:${color};"><i class="fas fa-map-marker-alt fa-3x" id=${location.vehicleid}></i></div>`,
        iconSize: [27, 37], // TODO: Move this to config file?
        iconAnchor: [13.5, 37] // TODO: Move this to config file?
      });            

      var tooltip = `<div class="text-center">
                        <div>                          
                          <img class ="avatar" src="${vehicle?.foto}">
                        </div>
                        <div>                          
                          <p>${vehicle?.make} ${vehicle?.model} ${vehicle?.year}</p>
                          <p>Address: ${result.display_name}</p>
                        </div>
                    </div>`;

      if (this.markers[location.vehicleid]) {
        this.markers[location.vehicleid].setLangLng([location.lat, location.lon]);
      } else {
        this.markers[location.vehicleid] = L.marker([location.lat, location.lon], { autoPan: true, icon: icon }).addTo(this.map)
          .bindTooltip(tooltip)
          .on('click', this.onMarkerClick.bind(this));

        var elem = this.markers[location.vehicleid];
        var tooltipElem = elem.getTooltip();
        tooltipElem.addEventListener('click', function(e) {          
          e.toggleTooltip();
        });
      }       
    }    
  }

  onMarkerClick(e: any) {    
    for (let key in this.markers) {
      let value = this.markers[key];
      if (value === e.target) this.selectedVehicleId = +key;
    }
    this.map.setView(e.target.getLatLng(), 13);    
  }

  onListItemSelect(id: number): void {
    this.selectedVehicleId = id; 
    var marker = this.markers[id];    
    this.map.panTo(marker.getLatLng()); 
    this.map.setView(marker.getLatLng(), 13);

    marker.toggleTooltip();
  }
}
