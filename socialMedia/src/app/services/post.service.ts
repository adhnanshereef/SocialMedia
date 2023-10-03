import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { CreatePost, Post } from '../interfaces/post';
import { BACKEND_URL } from '../config';
import { MiniUser } from '../interfaces/profile';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${BACKEND_URL}/post/all/`);
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`${BACKEND_URL}/post/${id}/`);
  }
  likePost(postId: string): Observable<{ do: string; user: MiniUser }> {
    if (this.authService.isAuthenticated()) {
      const id = parseInt(postId);
      return this.http.post<{ do: string; user: MiniUser }>(
        `${BACKEND_URL}/post/like/`,
        { id }
      );
    }
    return {} as Observable<{ do: string; user: MiniUser }>;
  }

  createPost(post: CreatePost) {
    if (this.authService.isAuthenticated()) {
      const formData = new FormData();
      if (post.photo) {
        formData.append('photo', post.photo);
      }
      if (post.title) {
        formData.append('title', post.title);
      }
      if (post.content) {
        formData.append('content', post.content);
      }
      const response = this.http.post<string>(
        `${BACKEND_URL}/post/create/`,
        formData
      );
      response.subscribe({
        next: (dataId) => {
          this.router.navigateByUrl(`/post/${dataId}`);
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
}
