import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/bookings/booking.service';

import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  isLoading = false;
  place: Place;
  placeId: string;
  isBookable = false;
  private _placeSub: Subscription;

  constructor(
    private _placesService: PlacesService,
    private _navController: NavController,
    private _activatedRoute: ActivatedRoute,
    private _modalController: ModalController,
    private _actionSheetController: ActionSheetController,
    private _bookingService: BookingService,
    private _loadingController: LoadingController,
    private _authService: AuthService,
    private _alertController: AlertController,
    private _router: Router
  ) {}

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this._navController.navigateBack('/places/tabs/discover');
        return;
      }

      this.placeId = paramMap.get('placeId');
      this.isLoading = true;

      let fetchedUserId: string;
      this._authService.userId
        .pipe(
          switchMap((userId) => {
            if (!userId) {
              throw new Error('No user found!');
            }

            fetchedUserId = userId;

            return this._placesService.getPlace(this.placeId);
          })
        )
        .subscribe(
          (place) => {
            this.place = place;
            this.isBookable = place.userId !== fetchedUserId;
            this.isLoading = false;
          },
          (error) => {
            this._alertController
              .create({
                header: 'An error occurred',
                message: 'Could not load place.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this._router.navigate(['/places/tabs/discover']);
                    },
                  },
                ],
              })
              .then((alertEl) => {
                alertEl.present();
              });
          }
        );
    });
  }

  ngOnDestroy(): void {
    this._placeSub?.unsubscribe();
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
        componentProps: { selectedPlace: this.place, selectedMode: mode },
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
          this._loadingController
            .create({
              message: 'Create Booking...',
            })
            .then((loaderEl) => {
              loaderEl.present();
              const data = resultData.data.bookingData;
              this._bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  data.firstName,
                  data.lastName,
                  data.guestNumber,
                  data.dateFrom,
                  data.dateTo
                )
                .subscribe(() => {
                  loaderEl.dismiss();
                });
            });
        }
      });
  }
}
