
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { OrderService } from '../orders.service';
import { Router } from '@angular/router';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: false
})
export class CheckoutComponent implements OnInit {
  customerAddresses: any[] = [];
  cartDetails: any;
  totalAmountWithGST: number = 0;
  deliveryFee: number = 0;
  gstPercentage: number = 0.18;

  currentUserId: number | null = null;

  selectedAddress: any;


  paymentOptions = [
    { id: 1, type: 'Credit/Debit Card', class: 'bi bi-credit-card', comment: 'Visa, Mastercard, Rupay' },
    { id: 2, type: 'UPI', class: 'bi bi-qr-code', comment: 'Google Pay, PhonePe, Paytm' },
    { id: 3, type: 'Cash on Delivery', class: 'bi bi-truck', comment: 'Pay when you receive your order' }
  ];

  selectedPaymentMethod: number = 1;

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    // Get the logged-in user ID from your AuthService
    this.currentUserId = this.authService.getUserId();

    if (this.currentUserId) {
      this.fetchCustomerData(this.currentUserId);
      this.fetchCartData(this.currentUserId);
    } else {
      console.error("No user is logged in. Please log in to view checkout.");
      // Optionally redirect to login page
      // this.authService.logout();
    }
  }

  fetchCustomerData(userId: number): void {
    this.orderService.getCustomer(userId).subscribe(
      customers => {
        if (customers && customers.length > 0) {
          this.customerAddresses = customers[0].address;
          // Set the first address as default selection if any exists
          if (this.customerAddresses.length > 0) {
            this.selectedAddress = this.customerAddresses.find(addr => addr.isDefault) || this.customerAddresses[0];
          }
        }
      },
      error => {
        console.error('Error fetching customer addresses:', error);
      }
    );
  }

  fetchCartData(userId: number): void {
    this.orderService.getCart(userId).subscribe(
      carts => {
        if (carts && carts.length > 0) {
          this.cartDetails = carts[0];
          this.calculateFinalTotal();
        }
      },
      error => {
        console.error('Error fetching cart details:', error);
      }
    );
  }

  calculateFinalTotal(): void {
    if (this.cartDetails && this.cartDetails.totalAmount) {
      const subtotal = this.cartDetails.totalAmount;
      const gstAmount = subtotal * this.gstPercentage;
      this.totalAmountWithGST = subtotal + gstAmount + this.deliveryFee;
    }
  }

  // Method to handle address selection (if you want to implement selecting one address)
  selectAddress(address: any): void {
    this.selectedAddress = address;
  }

  onPlaceOrder(): void {
    if (!this.cartDetails || !this.currentUserId || !this.selectedAddress) {
      alert('Please ensure you have items in your cart and an address selected.');
      return;
    }

    const newOrder = {
      orderID: new Date().getTime(),
      userID: this.currentUserId,
      restID: this.cartDetails.restID,
      items: this.cartDetails.items,
      totalAmount: this.totalAmountWithGST,
      totalItems: this.cartDetails.itemCount,
      status: 'placed', //default it will be set to accepted
      deliveryAddress: this.selectedAddress,
      paymentMethod: this.selectedPaymentMethod,
      orderDate: new Date().toISOString()
    };

    this.orderService.placeOrder(newOrder).subscribe(
      response => {
        console.log('Order placed successfully:', response);
        localStorage.setItem('newOrderPlaced', 'true');
        this.cartService.clearCart().subscribe();
        alert('Order placed successfully!');
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again.');
      }
    );
  }
}



