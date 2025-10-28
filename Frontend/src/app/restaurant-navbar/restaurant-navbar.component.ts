import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-restaurant-navbar',
  standalone: false,
  templateUrl: './restaurant-navbar.component.html',
  styleUrl: './restaurant-navbar.component.css'
})
export class RestaurantNavbarComponent {

  constructor(private router: Router, private authService: AuthService) { }

  restaurantLogout() {
    this.authService.restLogout();
    this.router.navigate(['/restaurantLogin']);
  }
}
