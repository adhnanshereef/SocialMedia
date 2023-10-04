import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BACKEND_URL } from 'src/app/config';
import { User } from 'src/app/interfaces/auth';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  post: Post | undefined;
  loaded: boolean = false;
  user: User | undefined;
  backend_url = BACKEND_URL;
  constructor(
    private postService: PostService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.postService.getPost(id).subscribe({
        next: (post) => {
          this.post = post;
          this.loaded = true;
        },
        error: (error) => {
          if (error.status == 404) {
            this.loaded = true;
          }
          console.log(error);
        },
      });
    } else {
      this.loaded = true;
    }
    this.userService.user$.subscribe({
      next: (data) => {
        this.user = data;
      },
    });
  }
  likePost() {
    if (this.post) {
      this.postService.likePost(this.post.id.toString()).subscribe({
        next: (data) => {
          if (data && this.post) {
            if (data.do == 'liked') {
              this.post.likes.push(data.user);
            } else {
              this.post.likes = this.post.likes.filter((user) => {
                return user.username !== data.user.username;
              });
            }
          }
        },
      });
    }
  }
  deletePost() {
    if (this.post) {
      this.postService.deletePost(this.post.id.toString())
    }
  }
}
