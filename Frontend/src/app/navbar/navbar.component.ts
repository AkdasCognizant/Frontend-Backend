import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserCart } from '../models/cart.model';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: false
})
export class NavbarComponent implements OnInit {
  @Input() cartItemsCount: number = 0;
  isMobileMenuOpen = false;

  navLinks = [
    { href: '/home', label: 'Home' },
    { href: '/restaurant', label: 'Restaurants' },
    { href: '/help', label: 'Help' },
    { href: '/aboutus', label: 'About Us' }
  ];
  cart: UserCart | null = null;

  constructor(private router: Router, private authService: AuthService, private cartService: CartService) { }

  searchQuery: string = '';


  ngOnInit(): void {
    this.cartService.cart$.subscribe(c => this.cart = c);
  }

  get cartItemCount(): number {
    return this.cart?.itemCount ?? 0;
  }



  onCartClick() {
    this.navigateWithAuth('/cart');
  }

  onProfileClick() {
    this.navigateWithAuth('/profile');
  }

  navigateWithAuth(targetRoute: string) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([targetRoute]);
    } else {
      this.router.navigate(['/login'], { queryParams: { redirectTo: targetRoute } });
    }
  }



}

