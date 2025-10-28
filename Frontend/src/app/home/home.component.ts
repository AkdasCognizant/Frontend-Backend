import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../orders.service';
import { AuthService } from '../auth.service';
import { Order } from '../models/order.model';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  latestOrder: Order | null = null;
  showSnackbar = false;

  restaurants: any[] = [];
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private router: Router,
    private orderService: OrderService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    // Load restaurants
    this.restaurantService.getRestaurants(this.id).subscribe(data => {
      this.restaurants = data;
    });

    // Load latest order for current user
    const userID = this.auth.getUserId();
    const orderPlacedFlag = localStorage.getItem('newOrderPlaced');
    if (orderPlacedFlag === 'true') {

      this.orderService.getOrdersByUser(userID).subscribe(orders => {
        if (orders.length > 0) {
          this.latestOrder = orders.sort((a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          )[0];

          if (this.latestOrder.status == 'placed') {
            this.showSnackbar = true;
            setTimeout(() => this.showSnackbar = false, 6000);
            localStorage.removeItem('newOrderPlaced');
            // auto-hide
          }


          if (this.latestOrder.status == 'preparing') {
            this.showSnackbar = true;
            setTimeout(() => this.showSnackbar = false, 6000);
            // auto-hide
          }

          if (this.latestOrder.status == 'out for delivery') {
            this.showSnackbar = true;
            setTimeout(() => this.showSnackbar = false, 6000);
            // auto-hide
          }

          if (this.latestOrder.status == 'delivered') {
            this.showSnackbar = true;
            setTimeout(() => this.showSnackbar = false, 6000);
            // auto-hide
          }

        }
      });
    }
  }


}