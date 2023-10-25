import { Component, OnInit, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BACKEND_URL } from 'src/app/config';
import { TokenUser, User } from 'src/app/interfaces/auth';
import { Post } from 'src/app/interfaces/post';
import { AlertService } from 'src/app/services/alert.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  Tuser: TokenUser = {} as TokenUser;
  user: User|undefined;
  posts: Post[] = [];
  loaded: boolean = false;
  loading: boolean = false;
  page: number = 1;
  finished: boolean = false;
  backend_url = BACKEND_URL;
  constructor(
    private userService: UserService,
    private postService: PostService,
    private titleService: Title,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.loadPosts();
    this.userService.user$.subscribe({
      next: (data) => {
        if (data) {
          this.user = data;
        }
      },
    });
    this.titleService.setTitle('Home | Social Media');
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this.loading && this.shouldLoadMore()) {
      this.loading = true;
      this.loadPosts();
    }
  }

  shouldLoadMore(): boolean {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Load more posts when the user is 90% through the current content
    return scrollY + windowHeight >= documentHeight * 0.9;
  }

  loadPosts() {
    if (this.finished == false) {
      this.postService.getPosts(this.page).subscribe({
        next: (data) => {
          this.posts = this.posts.concat(data.results);
          this.loaded = true;
          this.loading = false;
          this.page++;
        },
        error: (error) => {
          this.loading = false;
          if (error.status == 404) {
            this.finished = true;
            this.loaded = true;
          }else{
            this.finished = true;
            this.loaded = true;
            this.alertService.setAlert('Something went wrong, try again later.', error.status);
          }
        },
      });
    }
  }

  likePost(postId: string) {
    this.postService.likePost(postId).subscribe({
      next: (data) => {
        if (data) {
          this.posts = this.posts.map((post) => {
            if (post.id === parseInt(postId)) {
              if (data.do == 'liked') {
                post.likes.push(data.user);
              } else {
                post.likes = post.likes.filter((user) => {
                  return user.username !== data.user.username;
                });
              }
            }
            return post;
          });
        }
      },
      error: (error) => {
        this.alertService.setAlert('Something went wrong, try again later.', error.status);
      },
    });
  }
  deletePost(id: number) {
    this.postService.deletePost(id.toString());
  }
}
