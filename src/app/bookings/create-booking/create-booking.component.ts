import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;

  constructor(private _modalController: ModalController) {}

  ngOnInit() {}

  onBookPlace(): void {
    this._modalController.dismiss(
      { message: 'This is a dummy message!' },
      'confirm',
      'booking'
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
}
