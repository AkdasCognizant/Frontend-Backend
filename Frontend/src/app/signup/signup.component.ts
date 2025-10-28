import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { CommonModule, NgIf } from '@angular/common';
import { User } from '../user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: false
  // imports: [ReactiveFormsModule, CommonModule, NgIf, RouterModule],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  submitted = false;
  message = '';
  termsAccepted = false;

  constructor(private fb: FormBuilder, private userService: UserService, private route: Router) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      termsAccepted: [false, [Validators.requiredTrue]]
    });

  }

  get f() {
    return this.signupForm.controls;
  }

  // onSubmit(): void {
  //   this.submitted = true;

  //   if (this.signupForm.invalid) return;

  //   const newUser: User = this.signupForm.value;

  //   this.userService.signUp(newUser).subscribe({
  //     next: () => {
  //       alert('Customer signed up successfully!');
  //       this.message = 'Customer signed up successfully!';
  //       this.signupForm.reset();
  //       this.termsAccepted = false;
  //       this.submitted = false;
        
  //     },
  //     error: () => {
  //       alert('Signup failed. Please try again!');
  //       this.message = 'Signup failed. Please try again!';
  //     }
  //   });

  //   this.route.navigate(['/login']);
  // }

  onSubmit(): void {
  this.submitted = true;

  if (this.signupForm.invalid) return;

  // Convert phone to string to match backend expectations
  const newUser: User = {
    ...this.signupForm.value,
    phone: this.signupForm.value.phone.toString()
  };

  this.userService.signUp(newUser).subscribe({
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

  this.route.navigate(['/login']);
}

}
