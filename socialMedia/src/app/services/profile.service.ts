import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../config';
import { Observable } from 'rxjs';
import { User } from '../interfaces/auth';
import {
  FollowReturn,
  FollowersFollowings,
} from '../interfaces/profile';
import { isPlatformServer } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private isServer: boolean;
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isServer = isPlatformServer(platformId);
  }

  getProfile(username: string): Observable<User> {
    return this.http.get<User>(`${BACKEND_URL}/i/users/${username}`);
  }
  getFollowersFollowings(username: string): Observable<FollowersFollowings> {
    return this.http.get<FollowersFollowings>(
      `${BACKEND_URL}/i/ff/${username}/`
    );
  }
  getFollowings(username: string): Observable<boolean> {
    if (this.isServer)
      return new Observable<boolean>((observer) => observer.next(false));
    return this.http.post<boolean>(`${BACKEND_URL}/i/following/`, { username });
  }
  follow(username: string): Observable<FollowReturn> {
    if (this.isServer) return {} as Observable<FollowReturn>;
    return this.http.post<FollowReturn>(`${BACKEND_URL}/i/follow/`, {
      username,
    });
  }
}
