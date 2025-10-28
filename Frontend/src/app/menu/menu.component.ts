import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../cart.service';
import { Cartitem } from '../models/cart.model';
import { UserCart } from '../models/cart.model';

interface Item {
  Itemid: number;
  name: string;
  price: number;
  image: string;
  imageUrl?: string;
  originalPrice?: number;
}

interface MenuItems {
  restaurantId: number;
  items: Item[];
}

@Component({
  selector: 'app-menu',

  templateUrl: './menu.component.html',
  standalone: false,
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  restaurantId!: number;
  restaurantName!: string;
  menuItems: Item[] = [];
  cart: UserCart | null = null;
  showSnackbar = false;
  snackbarMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cartService: CartService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.cartService.cart$.subscribe(c => this.cart = c);
    this.route.paramMap.subscribe(pm => {
      const id = pm.get('id');
      if (!id) return;

      this.restaurantId = +id;
      this.http.get<any[]>('http://localhost:3000/restaurants')
        .subscribe(restaurants => {
          const restaurant = restaurants.find(r => +r.id === this.restaurantId);
          this.restaurantName = restaurant?.name || `Restaurant #${this.restaurantId}`;
        }); this.http
          .get<MenuItems[]>('http://localhost:3000/menus')
          .subscribe(menus => {
            const menu = menus.find(m => m.restaurantId === this.restaurantId);
            if (menu) {
              this.menuItems = menu.items.map(i => ({
                ...i,
                imageUrl: i.image
              }));
            }
          });
    });
  }
  addToCart(item: Item): void {
    const line: Cartitem = {
      itemID: item.Itemid,
      name: item.name,
      price: item.price,
      quantity: 1,
      originalPrice: item.originalPrice,
      image: item.image
    };

    if (this.cart && this.cart.restID !== this.restaurantId) {
      alert(
        `Your cart already contains items from "${this.cart.restaurantName}".\n` +
        `Please checkout or clear your cart before adding items from "${this.restaurantName}".`
      );
      return;
    }

    this.cartService.addItem(line, this.restaurantId, this.restaurantName).subscribe({
      next: () => {
        this.snackbarMessage = `${item.name} added to cart`;
        this.showSnackbar = true;
        setTimeout(() => this.showSnackbar = false, 1200);
      },
      error: err => {
        console.error('Failed to add item to cart', err);
        this.snackbarMessage = `Failed to add ${item.name} to cart`;
        this.showSnackbar = true;
        setTimeout(() => this.showSnackbar = false, 1500);
      }
    });
  }


  proceedToCart(): void {
    this.router.navigate(['/cart']);
  }

  trackByItemId(_: number, item: Item): number {
    return item.Itemid;
  }
}
