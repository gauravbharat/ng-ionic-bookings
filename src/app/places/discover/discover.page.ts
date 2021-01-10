import { Component, OnInit } from '@angular/core';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[];

  constructor(private _placesService: PlacesService) {}

  ngOnInit() {
    this.loadedPlaces = this._placesService.places;
    console.log('this.loadedPlaces', this.loadedPlaces);
  }

  // onViewWillEnter() {
  //   this.loadedPlaces = this._placesService.places;
  //   console.log('this.loadedPlaces', this.loadedPlaces);
  // }
}
