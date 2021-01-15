import { Component, OnInit } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBookings: Booking[];

  constructor(private _bookingService: BookingService) {}

  ngOnInit() {
    this.loadedBookings = this._bookingService.bookings;
  }

  onCancelBooking(bookingId: string, slidingBooking: IonItemSliding): void {
    slidingBooking.close();
    // this.loadedBookings = this._bookingService.deleteBooking(bookingId);
  }
}
