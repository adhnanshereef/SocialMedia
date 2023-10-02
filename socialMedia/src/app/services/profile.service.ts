import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../config';
import { Observable } from 'rxjs';
import { User } from '../interfaces/auth';
import {
  FollowReturn,
  MiniUser,
  FollowersFollowings,
} from '../interfaces/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile(username: string): Observable<User> {
    return this.http.get<User>(`${BACKEND_URL}/i/users/${username}`);
  }
  getFollowersFollowings(username: string): Observable<FollowersFollowings> {
    return this.http.get<FollowersFollowings>(
      `${BACKEND_URL}/i/ff/${username}/`
    );
  }
  getFollowings(username: string): Observable<boolean> {
    return this.http.post<boolean>(
      `${BACKEND_URL}/i/following/`,
      { username }
    );
  }
  follow(username: string): Observable<FollowReturn> {
    return this.http.post<FollowReturn>(`${BACKEND_URL}/i/follow/`, {
      username,
    });
  }
}
