import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Booking } from './booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private _authService: AuthService, private _http: HttpClient) {}

  get bookings(): Observable<Booking[]> {
    return this._bookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let newBooking;

    return this._authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          // return of(null);
          throw new Error('No user id found!');
        }

        newBooking = new Booking(
          Math.random().toString(),
          placeId,
          userId,
          placeTitle,
          placeImage,
          firstName,
          lastName,
          guestNumber,
          dateFrom,
          dateTo
        );

        return this.bookings;
      }),
      take(1),
      delay(1000),
      tap((bookings) => {
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  cancelBooking(bookingId: string) {
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap((bookings) => {
        this._bookings.next(bookings.filter((b) => b.id !== bookingId));
      })
    );
  }

  // deleteBooking(bookingId: string): Booking[] {
  //   return this.bookings.pipe(
  //     take(1),
  //     delay(1000),
  //     tap(bookings => {

  //     })
  //   )

  //   const index = this._bookings.findIndex(
  //     (booking) => booking.id === bookingId
  //   );
  //   this._bookings.slice(index, 1);
  //   return this.bookings;
  // }
}
