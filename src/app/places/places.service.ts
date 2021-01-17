import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York city!',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042534/Felix_Warburg_Mansion_007.jpg',
      149.99,
      new Date('2021-01-16'),
      new Date('2021-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris!',
      'https://www.jetsetter.com/wp-content/uploads/sites/7/2018/04/OYZG5PLW-1090x690.jpeg',
      189.99,
      new Date('2021-01-16'),
      new Date('2021-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://cdn.suwalls.com/wallpapers/nature/foggy-path-to-the-mansion-36709-1920x1200.jpg',
      99.99,
      new Date('2021-01-16'),
      new Date('2021-12-31'),
      'abc'
    ),
  ]);

  constructor(private _authService: AuthService) {}

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string): Observable<Place> {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042534/Felix_Warburg_Mansion_007.jpg',
      price,
      dateFrom,
      dateTo,
      this._authService.userId
    );

    this.places
      .pipe(take(1))
      .subscribe((places) => this._places.next(places.concat(newPlace)));
  }
}
