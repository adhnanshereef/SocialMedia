import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import {
  Observable,
  throwError,
  catchError,
  switchMap,
  BehaviorSubject,
  finalize,
  filter,
  take,
} from 'rxjs';
import { AuthService } from './services/auth.service';
import { Tokens } from './interfaces/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isRefreshingToken: boolean = false;
  refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      this.authService.authenticationStatus() &&
      !request.url.endsWith('/auth/token/refresh/') &&
      !request.url.endsWith('/auth/token/') &&
      !request.url.endsWith('/post/all/')
    ) {
      request = this.addToken(request, this.authService.getAccessToken());
    }

    return next.handle(request).pipe(
      catchError((error: any) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          this.authService.authenticationStatus() &&
          !request.url.endsWith('/auth/token/refresh/')
        ) {
          return this.handle401Error(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.refreshTokenSubject.next(null);

      return this.authService.refreshTokenObservable().pipe(
        switchMap((tokens: Tokens) => {
          if (this.authService.validateTokens(tokens)) {
            this.refreshTokenSubject.next(tokens.access);
            this.authService.setTokens(tokens);
            return next.handle(this.addToken(request, tokens.access));
          }

          // If we don't get a new token, we are in trouble so logout.
          this.authService.logout();
          return throwError(() => 'Token refresh failed.');
        }),
        catchError((error) => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          this.authService.logout();
          return throwError(() => error);
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          if (token) {
            return next.handle(this.addToken(request, token));
          }
          this.authService.logout();
          return throwError(() => 'Token refresh failed.');
        })
      );
    }
  }
}
