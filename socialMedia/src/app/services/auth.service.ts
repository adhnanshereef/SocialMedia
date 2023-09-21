import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { TokenUser, Tokens } from '../interfaces/auth';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private http: HttpClient
  ) {}
  // Check whether the user is authenticated or if not redirect to the login page
  isAuthenticated(): boolean {
    if (this.cookieService.check('access_token')) {
      return true;
    } else {
      this.router.navigateByUrl('/auth/login');
      return false;
    }
  }

  authenticationStatus(): boolean {
    return this.cookieService.check('access_token');
  }


  getUser(): TokenUser {
    const token = this.cookieService.get('access_token');
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const user: TokenUser = JSON.parse(decodedPayload);
    return user;
  }

  setTokens(tokens: Tokens): void {
    const storedAccess = this.cookieService.get('access_token');
    const storedRefresh = this.cookieService.get('refresh_token');
    if (storedAccess !== tokens.access) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 90);
      this.cookieService.set('access_token', tokens.access, {
        expires: expirationDate,
        path: '/',
      });
    }
    if (storedRefresh !== tokens.refresh) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 90);
      this.cookieService.set('refresh_token', tokens.refresh, {
        expires: expirationDate,
        path: '/',
      });
    }
  }

  // Fetch the tokens from the server
  logIn(username: string, password: string) {
    const response = this.http.post(`${BACKEND_URL}/auth/token/`, {
      username,
      password,
    }) as Observable<Tokens>;
    response.subscribe({
      next: (tokens) => {
        this.setTokens(tokens);
        this.router.navigateByUrl('');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  signUp(username: string, name: string, email: string, password: string) {
    const response = this.http.post(`${BACKEND_URL}/auth/signup/`, {
      username,
      name,
      email,
      password,
    }) as Observable<Tokens>;
    response.subscribe({
      next: (tokens) => {
        this.setTokens(tokens);
        this.router.navigateByUrl('');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
