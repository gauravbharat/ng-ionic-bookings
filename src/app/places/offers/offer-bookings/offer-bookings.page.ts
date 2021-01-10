import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {
  constructor(private _navController: NavController) {}

  ngOnInit() {}

  onBookOffer(): void {
    this._navController.navigateBack('/places/tabs/offers');
  }
}
