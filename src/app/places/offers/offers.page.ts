import { Component, OnInit } from '@angular/core';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  offers: Place[];
  constructor(private _placesService: PlacesService) {}

  ngOnInit() {
    this.offers = this._placesService.places;
    console.log('this.offers', this.offers);
  }
}
