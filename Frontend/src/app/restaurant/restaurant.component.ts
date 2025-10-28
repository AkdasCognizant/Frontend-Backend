import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantService } from '../restaurant.service';


@Component({
  selector: 'app-restaurant',
  standalone: false,
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.css'
})
export class RestaurantComponent implements OnInit {
  restaurants: any[] = [];
  id!: number;


  constructor(
    // private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private router: Router
  ) { }

  ngOnInit() {
    this.restaurantService.getRestaurants(this.id).subscribe(data => {
      this.restaurants = data;
    });
  }

}