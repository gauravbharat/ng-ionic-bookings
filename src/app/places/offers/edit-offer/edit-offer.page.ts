import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  private _placeSub: Subscription;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _placesService: PlacesService,
    private _navController: NavController
  ) {}

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this._navController.navigateBack('/places/tabs/offers');
        return;
      }

      this._placeSub = this._placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe((place) => {
          this.place = place;
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              validators: [Validators.required],
            }),
            description: new FormControl(this.place.description, {
              validators: [Validators.required, Validators.maxLength(180)],
            }),
          });
        });
    });
  }

  ngOnDestroy(): void {
    this._placeSub?.unsubscribe();
  }

  onUpdateOffer(): void {
    if (!this.form) return;

    console.log('updateing offer...', this.form);
  }
}
