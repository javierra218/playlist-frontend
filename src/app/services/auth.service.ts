import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { backend } from '../constants/api-url';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'authToken';

  constructor(private readonly http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post(
        backend('/auth/authenticate'),
        { username, password },
        { responseType: 'text' }
      )
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response);
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en AuthService:', error);
    return throwError(
      () =>
        new Error(error.error?.message || 'Error desconocido en autenticación')
    );
  }
}
