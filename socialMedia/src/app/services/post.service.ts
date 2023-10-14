import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Comment, CreatePost, Post } from '../interfaces/post';
import { BACKEND_URL } from '../config';
import { MiniUser } from '../interfaces/profile';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  getPosts(page: number): Observable<any> {
    return this.http.get<any>(`${BACKEND_URL}/post/all/?page=${page}`);
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

  deletePost(postId: string) {
    if (this.authService.isAuthenticated()) {
      const id = parseInt(postId);
      const response = this.http.delete(`${BACKEND_URL}/post/${id}/delete/`);
      response.subscribe({
        next: (data) => {
          if (data) {
            alert('Post deleted successfully');
            if (this.router.url === '/') {
              window.location.reload();
            } else {
              this.router.navigateByUrl('/');
            }
          } else {
            alert('You are not authorized to delete this post');
          }
        },
        error: (error) => {
          alert(error.error)
        },
      });
    }
  }

  createComment(postId: string, content: string): Observable<Comment> {
    if (this.authService.isAuthenticated()) {
      const id = parseInt(postId);
      return this.http.post<Comment>(`${BACKEND_URL}/post/comment/create/`, {
        id,
        content,
      });
    }
    return {} as Observable<Comment>;
  }

  getComments(postId: string): Observable<Comment[]> {
    const id = parseInt(postId);
    return this.http.get<Comment[]>(`${BACKEND_URL}/post/comments/${id}/`);
  }
  deleteComment(commentId: string): Observable<Comment> {
    if (this.authService.isAuthenticated()) {
      const id = parseInt(commentId);
      return this.http.delete<Comment>(
        `${BACKEND_URL}/post/comment/${id}/delete/`
      );
    }
    return {} as Observable<Comment>;
  }
}
