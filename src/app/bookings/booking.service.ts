import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _bookings: Booking[] = [
    {
      id: 'xyz',
      placeId: 'p1',
      placeTitle: 'Manhattan Mansion',
      guestNumber: 2,
      userId: 'abc',
    },
  ];

  get bookings(): Booking[] {
    return [...this._bookings];
  }

  deleteBooking(bookingId: string): Booking[] {
    const index = this._bookings.findIndex(
      (booking) => booking.id === bookingId
    );
    this._bookings.slice(index, 1);
    return this.bookings;
  }
}
