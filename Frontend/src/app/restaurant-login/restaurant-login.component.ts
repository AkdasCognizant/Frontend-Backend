import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { RestaurantService } from '../restaurant.service';
import { restaurantUsers } from '../restaurantUsers';

@Component({
  selector: 'app-restaurant-login',
  templateUrl: './restaurant-login.component.html',
  styleUrls: ['./restaurant-login.component.css'],
  standalone: false,
})
export class RestaurantLoginComponent implements OnInit {
  restLoginForm!: FormGroup;
  message = '';

  redirectUrl: string = '/restaurantDashboard';

  constructor(
    private fb: FormBuilder,
    private restaurantsService: RestaurantService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.restLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    const container = document.getElementById('container') as HTMLElement;
    const registerBtn = document.getElementById('register') as HTMLButtonElement;
    const loginBtn = document.getElementById('login') as HTMLButtonElement;

    if (registerBtn && container) {
      registerBtn.addEventListener('click', () => {
        container.classList.add('active');
      });
    }

    if (loginBtn && container) {
      loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
      });
    }

    this.route.queryParams.subscribe(params => {
      // this.redirectUrl = params['redirect'] || '/restaurantDashboard';
      this.redirectUrl = '/restaurantDashboard';
    });
  }

  onLoginSuccess(): void {
    if (this.restLoginForm.invalid) return;

    const { email, password } = this.restLoginForm.value;

    this.restaurantsService.getCustomers().subscribe((restaurant: restaurantUsers[]) => {
      const matchedRestUser = restaurant.find(
        (restaurant) => restaurant.email === email && restaurant.password === password
      );

      if (matchedRestUser) {
        this.message = 'Login successful!';
        this.authService.restLogin(matchedRestUser);
        this.router.navigate([this.redirectUrl]);
      } else {
        this.message = 'Invalid email or password.';
        this.restLoginForm.get('email')?.setErrors({ invalid: true });
        this.restLoginForm.get('password')?.setErrors({ invalid: true });
      }
    });
  }
}