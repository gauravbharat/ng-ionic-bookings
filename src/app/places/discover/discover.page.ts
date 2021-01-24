import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

import { Plugins, Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { take } from 'rxjs/operators';

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
    private _authService: AuthService,
    private _alertController: AlertController
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

  private _showErrorAlert(message?: string) {
    this._alertController
      .create({
        header: 'Could not fetch location',
        message: `Please use the map to pick a location! ${
          message ? 'Error Message: ' + message : ''
        }`,
        buttons: [{ text: 'Close', role: 'cancel', cssClass: 'secondary' }],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  async onLocateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this._showErrorAlert();
      return;
    }

    this.isLoading = true;
    await Plugins.Geolocation.getCurrentPosition()
      .then((geoPosition) => {
        console.log('geoPosition', geoPosition);
        const coordinates = {
          lat: geoPosition.coords.latitude,
          long: geoPosition.coords.longitude,
        };

        console.log('coordinates', coordinates);
        this.isLoading = false;
      })
      .catch((error) => {
        console.log('geolocaiton error: ', error);
        this.isLoading = false;
        this._showErrorAlert();
      });
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

    this._authService.userId.pipe(take(1)).subscribe((userId) => {
      const isShown = (place) => filter === 'all' || place.userId !== userId;
      this.relevantPlaces = this.loadedPlaces.filter(isShown);
      this.listedLoadedPlaces = this.relevantPlaces?.slice(1);
      this._filter = filter;
    });

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
