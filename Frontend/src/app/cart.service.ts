import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { UserCart, Cartitem } from './models/cart.model';
@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:3000/cart';
  private cartSubject = new BehaviorSubject<UserCart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient, private auth: AuthService) {
    this.auth.currentUser$.subscribe(user =>
      user ? this.loadCart() : this.cartSubject.next(null)
    );
  }

  private get userID(): number {
    return this.auth.getUserId();
  }

  public loadCart(): void {
    this.http.get<UserCart[]>(`${this.apiUrl}?userID=${this.userID}`)
      .pipe(map(carts => carts[0] || null))
      .subscribe(cart => this.cartSubject.next(cart));
  }

public addItem(item: Cartitem, restID: number, restaurantName: string): Observable<UserCart | null> {
  const cart = this.cartSubject.value;

  if (!cart) {
    const newCart: Omit<UserCart, 'id'> = {
      userID: this.userID,
      restID,
      restaurantName,
      items: [item],
      itemCount: item.quantity,
      totalAmount: item.quantity * item.price
    };
    return this.http.post<UserCart>(this.apiUrl, newCart).pipe(
      tap(c => this.cartSubject.next(c))
    );
  } else {
    // ❌ Don't merge — check if item already exists
    const alreadyExists = cart.items.some(i => i.itemID === item.itemID);
    if (alreadyExists) {
      return new Observable<UserCart>(observer => {
        observer.next(cart); // return current cart without changes
        observer.complete();
      });
    }

    // ✅ Add new item only if it's not already in the cart
    const updatedItems = [...cart.items, item];
    return this.updateCart({ ...cart, items: updatedItems });
  }
}


  public increaseQuantity(itemID: number): Observable<UserCart|null> {
    const cart = this.cartSubject.value!;
    const items = cart.items.map(i =>
      i.itemID === itemID ? { ...i, quantity: i.quantity + 1 } : i
    );
    return this.updateCart({ ...cart, items });
  }

  public decreaseQuantity(itemID: number): Observable<UserCart | null> {
    const cart = this.cartSubject.value!;
    const items = cart.items
      .map(i => i.itemID === itemID ? { ...i, quantity: i.quantity - 1 } : i)
      .filter(i => i.quantity > 0);
    return this.updateCart({ ...cart, items });
  }

  public removeItem(item: Cartitem): Observable<UserCart | null> {
    const cart = this.cartSubject.value!;
    const items = cart.items.filter(i => i.itemID !== item.itemID);
    return this.updateCart({ ...cart, items });
  }

  public clearCart(): Observable<void> {
    const cart = this.cartSubject.value;
    if (cart?.id) {
      return this.http.delete<void>(`${this.apiUrl}/${cart.id}`).pipe(
        tap(() => this.cartSubject.next(null))
      );
    }
    return new Observable<void>(observer => {
      observer.next();
      observer.complete();
    });
  }

  

  private updateCart(cart: UserCart): Observable<UserCart | null> {
    const updated: UserCart = {
      ...cart,
      itemCount: cart.items.reduce((sum, i) => sum + i.quantity, 0),
      totalAmount: cart.items.reduce((sum, i) => sum + i.quantity * i.price, 0)
    };

    if (updated.items.length > 0) {
      return this.http.put<UserCart>(`${this.apiUrl}/${updated.id}`, updated).pipe(
        tap(c => this.cartSubject.next(c))
      );
    } else {
      return this.http.delete<void>(`${this.apiUrl}/${updated.id}`).pipe(
        tap(() => this.cartSubject.next(null)),
        map(() => null)
      );
    }
  }
}
