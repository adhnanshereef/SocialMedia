import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, catchError, switchMap, of } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Tokens } from './interfaces/auth';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      this.authService.authenticationStatus() &&
      !request.url.endsWith('/auth/token/refresh/') &&
      !request.url.endsWith('/auth/token/') &&
      !request.url.endsWith('/post/all/')&&
      !request.url.endsWith('/i/users/**/')
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
        } else if (request.url.endsWith('/auth/token/refresh/')) {
          this.authService.logout();
          return throwError(() => error);
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

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refreshTokenObservable().pipe(
      switchMap((tokens: Tokens) => {
        if (this.authService.validateTokens(tokens)) {
          this.authService.setTokens(tokens);
        }
        return next.handle(this.addToken(request, tokens.access));
      }),
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}


// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpErrorResponse,
// } from '@angular/common/http';
// import { Observable, throwError, BehaviorSubject } from 'rxjs';
// import { catchError, switchMap, filter, take, finalize, tap } from 'rxjs/operators';
// import { AuthService } from './services/auth.service';
// import { Tokens } from './interfaces/auth';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   private isRefreshing = false;
//   private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

//   constructor(private authService: AuthService) {}

//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     if (
//       this.authService.authenticationStatus() &&
//       !request.url.endsWith('/auth/token/refresh/') &&
//       !request.url.endsWith('/auth/token/') &&
//       !request.url.endsWith('/post/all/')
//     ) {
//       request = this.addToken(request, this.authService.getAccessToken());
//     }

//     return next.handle(request).pipe(
//       catchError((error: any) => {
//         if (
//           error instanceof HttpErrorResponse &&
//           error.status === 401 &&
//           this.authService.authenticationStatus() &&
//           !request.url.endsWith('/auth/token/refresh/')
//         ) {
//           return this.handle401Error(request, next);
//         } else if (request.url.endsWith('/auth/token/refresh/')) {
//           this.authService.logout();
//           return throwError(() => error);
//         } else {
//           return throwError(() => error);
//         }
//       })
//     );
//   }

//   private addToken(request: HttpRequest<any>, token: string) {
//     return request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   }

//   private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
//     if (!this.isRefreshing) {
//       this.isRefreshing = true;
//       this.refreshTokenSubject.next(null);

//       return this.authService.refreshTokenObservable().pipe(
//         switchMap((tokens: Tokens) => {
//           if (this.authService.validateTokens(tokens)) {
//             this.authService.setTokens(tokens);
//             this.refreshTokenSubject.next(tokens.access); // Signal that the token has been refreshed.
//             return next.handle(this.addToken(request, tokens.access)).pipe(
//               catchError((error) => {
//                 this.authService.logout();
//                 return throwError(() => error);
//               })
//             );
//           } else {
//             this.authService.logout();
//             return throwError(() => 'Token validation failed');
//           }
//         }),
//         catchError((error) => {
//           this.authService.logout();
//           return throwError(() => error);
//         }),
//         finalize(() => {
//           this.isRefreshing = false;
//         })
//       );
//     } else {
//       return this.refreshTokenSubject.pipe(
//         filter((token) => token !== null),
//         take(1),
//         switchMap((token) => {
//           return next.handle(this.addToken(request, token));
//         }),
//         tap(() => {
//           this.refreshTokenSubject.next(null); // Reset the token refresh subject.
//         })
//       );
//     }
//   }
// }
