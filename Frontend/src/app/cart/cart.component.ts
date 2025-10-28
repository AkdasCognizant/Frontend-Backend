import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../cart.service';
import { UserCart, Cartitem } from '../models/cart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone:false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  cart: UserCart | null = null;
  private sub = new Subscription();

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.cartService.cart$.subscribe(c => this.cart = c);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  increase(itemID: number): void {
    this.cartService.increaseQuantity(itemID).subscribe({
      next: () => {},
      error: err => console.error('Increase failed', err)
    });
  }

  decrease(itemID: number): void {
    this.cartService.decreaseQuantity(itemID).subscribe({
      next: () => {},
      error: err => console.error('Decrease failed', err)
    });
  }

  remove(item: Cartitem): void {
    this.cartService.removeItem(item).subscribe({
      next: () => {},
      error: err => console.error('Remove failed', err)
    });
  }

  clear(): void {
    this.cartService.clearCart().subscribe({
      next: () => {},
      error: err => console.error('Clear cart failed', err)
    });
  }

  getSubtotal(): number {
    return this.cart?.items.reduce((s, i) => s + i.price * i.quantity, 0) || 0;
  }

  getDeliveryFee(): number {
    return this.getSubtotal() > 500 ? 0 : 40;
  }

  getGST(): number {
    return Math.round(this.getSubtotal() * 0.18);
  }

  trackByLine(_: number, item: Cartitem): number {
    return item.itemID;
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}
