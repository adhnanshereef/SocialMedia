import { Component, OnInit } from '@angular/core';
import { BACKEND_URL } from 'src/app/config';
import { TokenUser, User } from 'src/app/interfaces/auth';
import { Post } from 'src/app/interfaces/post';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  Tuser: TokenUser = {} as TokenUser;
  user: User = {} as User;
  posts: Post[] = [];
  loaded: boolean = false;
  backend_url = BACKEND_URL;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.loaded = true;
      },
      error: (error) => {
        console.log(error);
      }
    });
    this.userService.user$.subscribe({
      next: (data) => {
        if (data) {
          this.user = data;
        }
      },
    });
  }

  logout() {
    this.authService.logOut();
  }

  deleteAccount() {
    this.authService.deleteAccount();
  }
}
