import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  place: Place;
  private _placesSub: Subscription;

  constructor(
    private _navController: NavController,
    private _activatedRoute: ActivatedRoute,
    private placesService: PlacesService
  ) {}

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this._navController.navigateBack('/places/tabs/offers');
        return;
      }

      this._placesSub = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe((place) => (this.place = place));
    });
  }

  ngOnDestroy(): void {
    this._placesSub?.unsubscribe();
  }

  onBookOffer(): void {
    this._navController.navigateBack('/places/tabs/offers');
  }
}
