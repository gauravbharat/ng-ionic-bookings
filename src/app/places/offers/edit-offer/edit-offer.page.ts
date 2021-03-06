import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../../place.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  isLoading = false;
  place: Place;
  placeId: string;
  form: FormGroup;
  private _placeSub: Subscription;
  private _updateSub: Subscription;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _placesService: PlacesService,
    private _navController: NavController,
    private _loadingController: LoadingController,
    private _alertController: AlertController,
    private _router: Router
  ) {}

  ngOnInit() {
    this._activatedRoute.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('placeId')) {
        this._navController.navigateBack('/places/tabs/offers');
        return;
      }

      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this._placeSub = this._placesService.getPlace(this.placeId).subscribe(
        (place) => {
          this.place = place;
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              validators: [Validators.required],
            }),
            description: new FormControl(this.place.description, {
              validators: [Validators.required, Validators.maxLength(180)],
            }),
          });
          this.isLoading = false;
        },
        (error) => {
          this._alertController
            .create({
              header: 'An error occurred',
              message: 'Place coud not be fetched. Please try again later.',
              buttons: [
                {
                  text: 'Okay',
                  handler: () => {
                    this._router.navigate(['/places/tabs/offers']);
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
    this._updateSub?.unsubscribe();
  }

  onUpdateOffer(): void {
    if (!this.form) return;

    console.log('updateing offer...', this.form);

    this._loadingController
      .create({
        message: 'Updating offer...',
      })
      .then((loadingEl) => {
        loadingEl.present();

        this._updateSub = this._placesService
          .updatePlace(
            this.place.id,
            this.form.get('title').value,
            this.form.get('description').value
          )
          .subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this._router.navigate(['/places/tabs/offers']);
          });
      });
  }
}
