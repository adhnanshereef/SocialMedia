import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/post';
import { BACKEND_URL } from '../config';
import { MiniUser } from '../interfaces/profile';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${BACKEND_URL}/post/all/`);
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${BACKEND_URL}/post/${id}/`);
  }
  likePost(postId: string): Observable<{do: string, user: MiniUser}> {
    if (this.authService.isAuthenticated()) {
      const id = parseInt(postId);
      return this.http.post<{do: string, user: MiniUser}>(`${BACKEND_URL}/post/like/`, { id });
    }
    return {} as Observable<{do: string, user: MiniUser}>;
  }
}
