import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../config';
import { Observable } from 'rxjs';
import { User } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getProfile(username: string): Observable<User> {
    return this.http.get<User>(`${BACKEND_URL}/i/users/${username}`);
  }
}
