import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode'; // Asegúrate de importar jwtDecode correctamente

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:4000/api';
  private userId: number | null = null;

  constructor(private http: HttpClient) {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId !== null) {
      this.userId = parseInt(storedUserId, 10);
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, userData).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        const token = response.token;
        if (token) {
          const decodedToken: any = jwtDecode(token);
          this.userId = decodedToken.userId;
          if (this.userId !== null) {
            localStorage.setItem('token', token);
            localStorage.setItem('userId', this.userId.toString());
          }
        }
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.userId = null;
  }

  getUserId(): number {
    if (this.userId === null) {
      throw new Error('User ID is not set');
    }
    return this.userId;
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getStock(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stock`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  uploadStock(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/stock/upload`, data);
  }
}
