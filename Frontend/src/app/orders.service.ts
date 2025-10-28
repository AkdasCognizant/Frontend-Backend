import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './models/order.model';
 
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiBaseUrl = 'http://localhost:3000';
 
  constructor(private http: HttpClient) { }
 
  getCustomer(userId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/customers?userID=${userId}`);
  }
 
  getCart(userId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/cart?userID=${userId}`);
  }
 
  placeOrder(order: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/orders`, order);
  }
  getOrdersByUser(userID: number): Observable<Order[]> {
  return this.http.get<Order[]>(`http://localhost:3000/orders?userID=${userID}`);
}

}