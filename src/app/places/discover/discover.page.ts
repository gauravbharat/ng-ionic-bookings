import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  private _placesSub: Subscription;

  constructor(private _placesService: PlacesService) {}

  ngOnInit() {
    this._placesSub = this._placesService.places.subscribe((places) => {
      this.loadedPlaces = places;
      this.listedLoadedPlaces = this.loadedPlaces.slice(1);
      console.log('this.loadedPlaces', this.loadedPlaces);
    });
  }

  ngOnDestroy(): void {
    this._placesSub?.unsubscribe();
  }

  onFilterUpdate(event: CustomEvent): void {
    console.log(event.detail);
  }

  // onViewWillEnter() {
  //   this.loadedPlaces = this._placesService.places;
  //   console.log('this.loadedPlaces', this.loadedPlaces);
  // }
}
