import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { restaurantUsers } from './restaurantUsers';
//import { Restaurant } from './restaurant/restaurant.component';

export interface MenuItem {
  id: number;
  name: string;
  price: number;
}

export interface Menu {
  restId: number;
  items: MenuItem[];
}

export interface Restaurant {
  id: number;
  name: string;
  rating: number;
  image: string;
}


@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  getMenuByRestaurantId(id: number): Observable<MenuItem[]> {
    return this.http.get<Menu[]>('http://localhost:3000/menus').pipe(
      map((menus: Menu[]) => {
        const menu = menus.find(m => m.restId === id);
        return menu ? menu.items : [];
      })
    );
  }


  constructor(private http: HttpClient) { }

  getRestaurants(id: number): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>('http://localhost:3000/restaurants');
  }
  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`http://localhost:3000/restaurants/${id}`);
  }




  //for restaurant dashboard
  // Insert a new customer
  private restUrl = 'http://localhost:3000/restaurantUsers';

  signUp(restaurant: restaurantUsers): Observable<restaurantUsers> {
    return this.http.post<restaurantUsers>(this.restUrl, restaurant);
  }

  // Get all customers
  getCustomers(): Observable<restaurantUsers[]> {
    return this.http.get<restaurantUsers[]>(this.restUrl);
  }

  updateCustomer(id: number, restaurants: restaurantUsers): Observable<restaurantUsers> {
    return this.http.put<restaurantUsers>(`${this.restUrl}/${id}`, restaurants);
  }



  //for restaurant current user 
  private baseUrl = 'http://localhost:3000';
 
  getMenuByRestID(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/menus?restaurantId=${id}`);
  }
}