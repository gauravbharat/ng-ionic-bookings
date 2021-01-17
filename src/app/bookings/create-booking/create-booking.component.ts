import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('f') form: NgForm;
  startDate: string;
  endDate: string;

  constructor(private _modalController: ModalController) {}

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);

    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() -
              7 * 25 * 60 * 60 * 1000 -
              availableFrom.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.startDate).getTime())
      ).toISOString();
    }
  }

  onBookPlace(): void {
    if (!this.form.valid || !this.datesValid()) return;

    this._modalController.dismiss(
      {
        bookingData: {
          firstName: this.form.value['firstName'],
          lastName: this.form.value['lastName'],
          guestNumber: +this.form.value['guestNumber'],
          dateFrom: new Date(this.form.value['dateFrom']),
          dateTo: new Date(this.form.value['dateTo']),
        },
      },
      'confirm',
      'booking' //this is the unique modal id set in create
    );
  }

  onCancel(): void {
    /** Pass 3 arguments to dismiss -
     * 1. return data
     * 2. action
     * 3. ID of dialog to close
     */
    this._modalController.dismiss(null, 'cancel', 'booking');
  }

  datesValid(): boolean {
    const startDate = new Date(this.form?.value['dateFrom']);
    const endDate = new Date(this.form?.value['dateTo']);

    return endDate > startDate;
  }
}
