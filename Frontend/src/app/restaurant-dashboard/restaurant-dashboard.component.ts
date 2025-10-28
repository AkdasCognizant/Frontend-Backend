import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuItem, Restaurant } from '../restaurant-dashboard/restaurantdb';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantService } from '../restaurant.service';
import { restaurantUsers } from '../restaurantUsers';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-restaurant-dashboard',
  standalone: false,
  templateUrl: './restaurant-dashboard.component.html',
  styleUrl: './restaurant-dashboard.component.css'
})
export class RestaurantDashboardComponent implements OnInit {
  restaurantName: string | undefined;
  menuItems: MenuItem[] = [];
  editingItem: MenuItem | null = null;
  restaurantId = 4;
  showAddForm: boolean = false;
  private menuId: number | undefined;
  itemForm: FormGroup;
  baseUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.itemForm = this.fb.group({
      Itemid: [0],
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      image: ['']
    });
  }

  currentRestUser: restaurantUsers | null = null;

  ngOnInit(): void {
    // First, fetch the menu items
    this.currentRestUser = this.authService.getCurrentRestUser();

    this.restaurantService.getMenuByRestID(this.restaurantId).subscribe({
      next: (data) => {
        const menu = data[0];
        if (menu) {
          this.menuId = menu.id;
          this.menuItems = menu.items || [];

          // Second, fetch the restaurant details inside the first subscription
          this.http.get<Restaurant>(`${this.baseUrl}/restaurants/${this.restaurantId}`).subscribe({
            next: (restaurant) => {
              if (restaurant) {
                this.restaurantName = restaurant.name;
              }
            },
            error: (err) => console.error('Error fetching restaurant name:', err)
          });
        }
      },
      error: (err) => console.error('Error fetching menu:', err),
      complete: () => console.log('Menu fetch complete.')
    });
  }

  editItem(item: MenuItem): void {
    this.editingItem = item;
    this.itemForm.patchValue(item);
  }

  saveEdit(): void {
    if (!this.editingItem || !this.menuId) return;

    const updatedItems = [...this.menuItems];
    const index = updatedItems.findIndex(i => i.Itemid === this.editingItem!.Itemid);
    if (index === -1) return;

    updatedItems[index] = this.itemForm.value as MenuItem;

    this.http.patch(`${this.baseUrl}/menus/${this.menuId}`, { items: updatedItems }).subscribe(() => {
      this.menuItems = updatedItems;
      this.editingItem = null;
      alert(`✅ Item updated successfully`);
    });
  }

  deleteItem(itemId: number): void {
    if (!this.menuId) return;

    const updatedItems = this.menuItems.filter(item => item.Itemid !== itemId);

    this.http.patch(`${this.baseUrl}/menus/${this.menuId}`, { items: updatedItems }).subscribe(() => {
      this.menuItems = updatedItems;
      alert(`🗑️ Item ${itemId} deleted successfully`);
    });
  }

  addItem(): void {
    if (!this.menuId || this.itemForm.invalid) return;

    const maxId = Math.max(...this.menuItems.map(i => i.Itemid), 0);
    const newItemWithId: MenuItem = { ...this.itemForm.value, Itemid: maxId + 1 };

    const updatedItems = [...this.menuItems, newItemWithId];

    this.http.patch(`${this.baseUrl}/menus/${this.menuId}`, { items: updatedItems }).subscribe({
      next: () => {
        this.menuItems = updatedItems;
        this.itemForm.reset();
        this.showAddForm = false;
        alert(`✅ Item "${newItemWithId.name}" added successfully`);
      },
      error: (err) => {
        alert(`❌ Failed to add item. Error: ${JSON.stringify(err)}`);
      },
      complete: () => {
        console.log('Add item operation complete.');
      }
    });
  }
}
