import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../config';
import { Observable } from 'rxjs';
import { User } from '../interfaces/auth';
import { FollowReturn, FollowUser, FollowersFollowings } from '../interfaces/profile';

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
  getFollowings(): Observable<{ following: FollowUser[] }> {
    return this.http.get<{ following: FollowUser[] }>(
      `${BACKEND_URL}/i/following/`
    );
  }
  follow(username: string): Observable<FollowReturn> {
    return this.http.post<FollowReturn>(`${BACKEND_URL}/i/follow/`, { username });
  }
}
