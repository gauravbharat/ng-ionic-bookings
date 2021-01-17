import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private _bookingSub: Subscription;

  constructor(
    private _bookingService: BookingService,
    private _loadingController: LoadingController
  ) {}

  ngOnInit() {
    this._bookingSub = this._bookingService.bookings.subscribe((bookings) => {
      this.loadedBookings = bookings;
    });
  }

  ngOnDestroy(): void {
    this._bookingSub?.unsubscribe();
  }

  onCancelBooking(bookingId: string, slidingBooking: IonItemSliding): void {
    slidingBooking.close();
    this._loadingController
      .create({
        message: 'Cancelling...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this._bookingService.cancelBooking(bookingId).subscribe(() => {
          loadingEl.dismiss();
        });
      });
  }
}
