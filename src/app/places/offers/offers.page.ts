import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  isLoading = false;
  private _placesSub: Subscription;

  constructor(
    private _placesService: PlacesService,
    private _navController: NavController
  ) {}

  ngOnInit() {
    this._placesSub = this._placesService.places.subscribe((places) => {
      this.offers = places;
    });
    console.log('this.offers', this.offers);
  }

  ngOnDestroy(): void {
    this._placesSub?.unsubscribe();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this._placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding): void {
    slidingItem.close();
    this._navController.navigateForward([
      '/',
      'places',
      'tabs',
      'offers',
      'edit',
      offerId,
    ]);
  }
}
