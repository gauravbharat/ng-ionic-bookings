import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

  constructor(private _authService: AuthService, private _http: HttpClient) {}

  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this._http
      .get<{ [key: string]: PlaceData }>(
        `https://ing-bookings-default-rtdb.firebaseio.com/offered-places.json`
      )
      .pipe(
        map((resData) => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }

          return places;
        }),
        tap((places) => {
          this._places.next(places);
        })
      );
  }

  getPlace(placeId: string): Observable<Place> {
    return this._http
      .get<Place>(
        `https://ing-bookings-default-rtdb.firebaseio.com/offered-places/${placeId}.json`
      )
      .pipe(
        map((placeData) => {
          return new Place(
            placeId,
            placeData.title,
            placeData.description,
            placeData.imageUrl,
            placeData.price,
            new Date(placeData.availableFrom),
            new Date(placeData.availableTo),
            placeData.userId
          );
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
    let generatedId: string;
    let newPlace;
    return this._authService.userId.pipe(
      take(1),
      switchMap((userId) => {
        if (!userId) {
          // return of(null);
          throw new Error('No user id found!');
        }

        newPlace = new Place(
          Math.random().toString(),
          title,
          description,
          'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042534/Felix_Warburg_Mansion_007.jpg',
          price,
          dateFrom,
          dateTo,
          userId
        );

        return this._http.post<{ name: string }>(
          `https://ing-bookings-default-rtdb.firebaseio.com/offered-places.json`,
          {
            ...newPlace,
            id: null,
          }
        );
      }),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.places;
      }),
      take(1),
      tap((places) => {
        newPlace.id = generatedId;
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap((places) => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap((places) => {
        const index = places.findIndex((pl) => pl.id === placeId);
        updatedPlaces = [...places];
        const oldData = updatedPlaces[index];
        updatedPlaces[index] = new Place(
          oldData.id,
          title,
          description,
          oldData.imageUrl,
          oldData.price,
          oldData.availableFrom,
          oldData.availableTo,
          oldData.userId
        );

        return this._http.put(
          `https://ing-bookings-default-rtdb.firebaseio.com/offered-places/${placeId}.json`,
          { ...updatedPlaces[index], id: null }
        );
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      })
    );
  }
}

/** 
 * 
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
      'xyz'
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
  ]
 */
