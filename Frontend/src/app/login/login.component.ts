import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';
import { User } from '../user';
import { HttpResponse } from '@angular/common/module.d-CnjH8Dlt';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
  // imports: [RouterModule, CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message = '';

  redirectUrl: string = '/home';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cartService:CartService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
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
      this.redirectUrl = params['redirect'] || '/home';
    });

     if (this.loginForm.invalid) return;

  const { email, password } = this.loginForm.value;

  }

  // onLoginSuccess(): void {
  //   if (this.loginForm.invalid) return;

  //   const { email, password } = this.loginForm.value;

  //   this.userService.getCustomers().subscribe((user: User[]) => {
  //     const matchedUser = user.find(
  //       (user) => user.email === email && user.password === password
  //     );

  //     if (matchedUser) {
  //       this.message = 'Login successful!';
  //       this.authService.login(matchedUser);
  //       this.router.navigate([this.redirectUrl]);this.cartService.loadCart();
  //     } else {
  //       this.message = 'Invalid email or password.';
  //       this.loginForm.get('email')?.setErrors({ invalid: true });
  //       this.loginForm.get('password')?.setErrors({ invalid: true });
  //     }
  //   });

    
    // LogIn Backend
    // this.userService.login({ email, password }).subscribe({
    //   next: (user: User) => {
    //     this.message = 'Login successful!';
    //     this.authService.login(user); // store user in auth service
    //     this.router.navigate([this.redirectUrl]);
    //     this.cartService.loadCart();
    //   },
    //   error: (err) => {
    //     this.message = err.status === 401 ? 'Invalid password.' : 'User not found.';
    //     this.loginForm.get('email')?.setErrors({ invalid: true });
    //     this.loginForm.get('password')?.setErrors({ invalid: true });
    //   }
    // });
  // }

//   onLoginSuccess(): void {
//   if (this.loginForm.invalid) return;

//   const { email, password } = this.loginForm.value;

//   this.userService.login(email, password).subscribe({
//     next: (response: any) => {
//       //  Store token and user info
//       const token = response.token;
//       localStorage.setItem('jwtToken', token);

//       // Optional: decode token to get user info or fetch user from backend
//       this.authService.setCurrentUser({ email }); // or fetch full user object if needed

//       this.message = 'Login successful!';
//       this.cartService.loadCart();
//       this.router.navigate(['/home']);
//     },
//     error: (err) => {
//       this.message = err.status === 401 ? 'Invalid password.' : 'User not found.';
//       this.loginForm.get('email')?.setErrors({ invalid: true });
//       this.loginForm.get('password')?.setErrors({ invalid: true });
//     }
//   });
// }

  // loginFormValidation()
  // {
  //   let email = this.loginForm.get(['email'])?.value;
  //   let password = this.loginForm.get(['password'])?.value;

  //   this.userService.login(email, password).subscribe
  //   ({
  //     next : (data:HttpResponse<any>) =>{
  //       console.log("Recieved data is: "+JSON.stringify(data));

  //       alert("You are a valid user");
  //     },

  //     error : (err) => alert("Invalid Credentails"),
  //     complete : () => console.log('Login operation is complete')
  //   });
  // }

  
loginFormValidation(): void {
  if (this.loginForm.invalid) return;

  const email = this.loginForm.get('email')?.value;
  const password = this.loginForm.get('password')?.value;

  this.userService.login(email, password).subscribe({
    next: (response: any) => {
      const token = response.token;
      const user = response.user;

      if (token && user) {
        this.authService.setToken(token);
        this.authService.setCurrentUser(user);
        this.cartService.loadCart();
        this.message = 'Login successful!';
        alert('You are a valid user');
        this.router.navigate(['/home']);
      } else {
        alert('Login failed: Invalid response from server');
      }
    },
    error: () => alert('Invalid Credentials'),
    complete: () => console.log('Login operation is complete')
  });
}


  

  //   loginFormValidation(): void {
  //   if (this.loginForm.invalid) return;

  //   const email = this.loginForm.get('email')?.value;
  //   const password = this.loginForm.get('password')?.value;

  //   this.userService.login(email, password).subscribe({
  //     next: (response: any) => {
  //       // ✅ Store token
  //       const token = response.token;
  //       localStorage.setItem('jwtToken', token);

  //       // ✅ Store user info (optional: decode token or fetch user)
  //       this.authService.setCurrentUser({ email });

  //       // ✅ Show success message and redirect
  //       this.message = 'Login successful!';
  //       alert('You are a valid user');
  //       this.cartService.loadCart();
  //       this.router.navigate(['/home']);
  //     },
  //     error: () => {
  //       this.message = 'Invalid credentials';
  //       alert('Invalid Credentials');
  //       this.loginForm.get('email')?.setErrors({ invalid: true });
  //       this.loginForm.get('password')?.setErrors({ invalid: true });
  //     },
  //     complete: () => console.log('Login operation is complete')
  //   });
  // }

}
