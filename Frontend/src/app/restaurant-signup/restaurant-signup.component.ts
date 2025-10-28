import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { RestaurantService } from '../restaurant.service';
import { restaurantUsers } from '../restaurantUsers';

@Component({
  selector: 'app-restaurant-signup',
  templateUrl: './restaurant-signup.component.html',
  styleUrls: ['./restaurant-signup.component.css'],
  standalone: false
  // imports: [ReactiveFormsModule, CommonModule, NgIf, RouterModule],
})
export class RestaurantSignupComponent implements OnInit {
  signupForm!: FormGroup;
  submitted = false;
  message = '';
  termsAccepted = false;

  constructor(private fb: FormBuilder, private restaurantsService: RestaurantService, private route: Router) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      rname: ['', [Validators.required]],
      oname: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required]],
      termsAccepted: [false, [Validators.requiredTrue]]
    });

  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.signupForm.invalid) return;

    const newUser: restaurantUsers = this.signupForm.value;

    this.restaurantsService.signUp(newUser).subscribe({
      next: () => {
        alert('Customer signed up successfully!');
        this.message = 'Customer signed up successfully!';
        this.signupForm.reset();
        this.termsAccepted = false;
        this.submitted = false;
      },
      error: () => {
        alert('Signup failed. Please try again!');
        this.message = 'Signup failed. Please try again!';
      }
    });

    this.route.navigate(['/restaurantLogin']);
  }
}