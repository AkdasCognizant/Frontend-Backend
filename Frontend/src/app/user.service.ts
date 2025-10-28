import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // ✅ Correct import
import { User } from './user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080';
  private loginUrl = 'http://localhost:8080/auth/login';

  constructor(private http: HttpClient) {}

  // signUp(user: User): Observable<User> {
  //   return this.http.post<User>(`${this.apiUrl}/auth/register`,  user, { responseType: 'text' as 'json' });
  // }

  signUp(user: User): Observable<string> {
    return this.http.post(`${this.apiUrl}/auth/register`, user, {
      responseType: 'text' as const
    });
  }




  getCustomers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getCustomerData`);
  }


  // Connected to backend
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { email, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('jwtToken', response.token);
        }
      })
    );
  }

  updateCustomer(user: User): Observable<string> {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`
    };

    return this.http.put(`${this.apiUrl}/auth/update`, user, {
      headers,
      responseType: 'text' as const
    });
  }


  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }
}
