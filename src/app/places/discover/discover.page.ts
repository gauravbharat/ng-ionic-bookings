import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  isLoading = false;
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  relevantPlaces: Place[];
  private _filter = 'all';

  private _placesSub: Subscription;

  constructor(
    private _placesService: PlacesService,
    private _authService: AuthService
  ) {}

  ngOnInit() {
    this._placesSub = this._placesService.places.subscribe((places) => {
      this.loadedPlaces = places;
      this.onFilterUpdate(this._filter);
      console.log('this.loadedPlaces', this.loadedPlaces);
    });
  }

  onViewWillEnter() {
    this.isLoading = true;
    this._placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    this._placesSub?.unsubscribe();
  }

  onFilterUpdate(filter: string): void {
    // if (filter === 'all') {
    //   this.relevantPlaces = this.loadedPlaces;
    //   this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    // } else {
    //   this.relevantPlaces = this.loadedPlaces.filter(
    //     (place) => place.userId !== this._authService.userId
    //   );
    //   this.listedLoadedPlaces = this.relevantPlaces?.slice(1);
    // }

    const isShown = (place) =>
      filter === 'all' || place.userId !== this._authService.userId;
    this.relevantPlaces = this.loadedPlaces.filter(isShown);
    this.listedLoadedPlaces = this.relevantPlaces?.slice(1);
    this._filter = filter;

    /** 
     * this.authService.userId.pipe(take(1)).subscribe(userId => {
    const isShown = place => filter === 'all' || place.userId !== userId;
    this.relevantPlaces = this.loadedPlaces.filter(isShown);
    this.filter = filter;
  });
     */
  }

  // onViewWillEnter() {
  //   this.loadedPlaces = this._placesService.places;
  //   console.log('this.loadedPlaces', this.loadedPlaces);
  // }
}
