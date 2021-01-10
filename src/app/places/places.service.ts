import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York city!',
      'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042534/Felix_Warburg_Mansion_007.jpg',
      149.99
    ),
    new Place(
      'p2',
      "L'Amour Toujours",
      'A romantic place in Paris!',
      'https://www.jetsetter.com/wp-content/uploads/sites/7/2018/04/OYZG5PLW-1090x690.jpeg',
      189.99
    ),
    new Place(
      'p3',
      'The Foggy Palace',
      'Not your average city trip!',
      'https://cdn.suwalls.com/wallpapers/nature/foggy-path-to-the-mansion-36709-1920x1200.jpg',
      99.99
    ),
  ];

  get places() {
    return [...this._places];
  }

  getPlace(id: string): Place {
    return { ...this._places.find((p) => p.id === id) };
  }

  constructor() {}
}
