import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  ModalController,
  NavController,
} from '@ionic/angular';

import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  constructor(
    private _placesService: PlacesService,
    private _navController: NavController,
    private _activatedRoute: ActivatedRoute,
    private _modalController: ModalController,
    private _actionSheetController: ActionSheetController
  ) {}
  place: Place;

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this._navController.navigateBack('/places/tabs/discover');
        return;
      }

      this.place = this._placesService.getPlace(paramMap.get('placeId'));
    });
  }

  onBookPlace(): void {
    this._actionSheetController
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
            },
          },
          { text: 'Cancel', role: 'cancel' },
          // {text: 'Cancel', role: 'destructive'}
        ],
      })
      .then((actionSheetEl) => actionSheetEl.present());

    // this._router.navigateByUrl('/places/tabs/discover');
    // Use Nav Controller, which under the hood uses angular router
    // but displays a backward animation than default forward
    // this._navController.navigateBack('/places/tabs/discover');
  }

  openBookingModal(mode: 'select' | 'random') {
    console.log('openBookingModal() : mode', mode);

    /** Open Modal instead of routing using Modal controller */
    this._modalController
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.place },
        id: 'booking',
      })
      .then((modalEl) => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then((resultData) => {
        console.log(
          'resultData.data:',
          resultData.data,
          'resultData.role:',
          resultData.role
        );

        if (resultData.role === 'confirm') {
          console.log('BOOKED!');
        }
      });
  }
}
