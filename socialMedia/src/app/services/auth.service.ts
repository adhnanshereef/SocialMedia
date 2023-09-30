import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { EditUser, TokenUser, Tokens, User } from '../interfaces/auth';
import { Observable, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../config';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}
  user: User | undefined;
  // Check whether the user is authenticated or if not redirect to the login page
  isAuthenticated(): boolean {
    if (this.validateTokens(this.getTokens())) {
      return true;
    } else {
      this.router.navigateByUrl('/auth/login');
      return false;
    }
  }

  authenticationStatus(): boolean {
    if (this.validateTokens(this.getTokens())) {
      return true;
    } else {
      return false;
    }
  }

  validateTokens(tokens: Tokens): boolean {
    if (
      !tokens ||
      !tokens.access ||
      !tokens.refresh ||
      tokens.access === '' ||
      tokens.refresh === ''
    ) {
      return false;
    }

    try {
      const payload_a = tokens.access.split('.')[1];
      atob(payload_a);
      const payload_r = tokens.refresh.split('.')[1];
      atob(payload_r);
    } catch (error) {
      this.logout();
      return false;
    }
    return true;
  }

  getTokenUser(): TokenUser {
    if (this.isAuthenticated()) {
      const token = this.cookieService.get('access_token');
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const user: TokenUser = JSON.parse(decodedPayload);
      return user;
    }
    return {} as TokenUser;
  }

  getTokens(): Tokens {
    const access = this.cookieService.get('access_token');
    const refresh = this.cookieService.get('refresh_token');
    return { access, refresh };
  }

  getAccessToken(): string {
    return this.cookieService.get('access_token');
  }

  getRefreshToken(): string {
    return this.cookieService.get('refresh_token');
  }

  setTokens(tokens: Tokens): void {
    if (this.validateTokens(tokens)) {
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
        this.fetchUser().subscribe({
          next: (data) => {
            this.userService.updateUser(data);
          },
          error: (error) => {
            console.log(error);
          },
        });
        this.router.navigateByUrl('');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  logOut() {
    this.userService.updateUser(undefined);
    this.cookieService.delete('access_token', '/');
    this.cookieService.delete('refresh_token', '/');
    this.router.navigateByUrl('/auth/login');
  }

  logout() {
    alert('Token expired. Login again.');
    this.logOut();
  }

  deleteAccount() {
    if (this.isAuthenticated()) {
      const response = this.http.delete(
        `${BACKEND_URL}/auth/delete/`
      ) as Observable<any>;
      response.subscribe({
        next: (data) => {
          this.logOut();
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  fetchUser(): Observable<User> {
    return this.http.get(`${BACKEND_URL}/auth/getuser/`) as Observable<User>;
  }

  refreshTokenObservable(): Observable<Tokens> {
    return from(
      fetch(`${BACKEND_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh: this.cookieService.get('refresh_token'),
        }),
      })
        .then((response) => response.json())
        .then((tokens: Tokens) => {
          return tokens;
        })
    );
  }

  refreshToken() {
    if (this.isAuthenticated()) {
      const response = this.http.post(`${BACKEND_URL}/auth/token/refresh/`, {
        refresh: this.cookieService.get('refresh_token'),
      }) as Observable<Tokens>;
      response.subscribe({
        next: (tokens: Tokens) => {
          this.setTokens(tokens);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  editUser(user: EditUser) {
    if (this.isAuthenticated()) {
      const formData = new FormData();
      if (user.username) {
        formData.append('username', user.username);
      }
      if (user.name) {
        formData.append('name', user.name);
      }
      if (user.email) {
        formData.append('email', user.email);
      }
      if (user.bio) {
        formData.append('bio', user.bio);
      }
      if (user.dateofbirth) {
        formData.append('dateofbirth', user.dateofbirth);
      }

      if (user.profile_pic) {
        formData.append('profile_pic', user.profile_pic);
      }

      const response = this.http.put(
        `${BACKEND_URL}/auth/edit/`,
        formData
      ) as Observable<User>;

      response.subscribe({
        next: (data) => {
          this.userService.updateUser(data);
          this.router.navigateByUrl('');
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      this.router.navigateByUrl('/auth/login');
    }
  }

  returnUser(): Observable<User> | undefined {
    if (this.authenticationStatus()) {
      return this.http.get<User>(`${BACKEND_URL}/auth/getuser/`);
    }

    return undefined;
  }
}
