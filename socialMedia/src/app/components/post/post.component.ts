import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BACKEND_URL } from 'src/app/config';
import { User } from 'src/app/interfaces/auth';
import { Comment, Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  post: Post | undefined;
  comments: Comment[] | undefined;
  newComment: string = '';
  loaded: boolean = false;
  user: User | undefined;
  backend_url = BACKEND_URL;
  constructor(
    private elementRef: ElementRef,
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
          this.postService.getComments(post.id.toString()).subscribe({
            next: (comments) => {
              this.comments = comments;

              this.loaded = true;
            },
            error: (error) => {
              if (error.status == 404) {
                this.loaded = true;
              }
              console.log(error);
            },
          });
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
      this.postService.deletePost(this.post.id.toString());
    }
  }
  addComment() {
    if (this.post) {
      this.postService
        .createComment(this.post.id.toString(), this.newComment)
        .subscribe({
          next: (data) => {
            if (data) {
              this.comments?.push(data);
              if(this.post){
                this.post.comments++;
              }
              this.newComment = '';
            }
          },
          error: (error) => {
            console.log(error);
          }
        });
    }
  }
  deleteComment(commentId: number) {
    if (this.post) {
      this.postService.deleteComment(commentId.toString()).subscribe({
        next: (data) => {
          if (data) {
            this.comments = this.comments?.filter((comment) => {
              return comment.id !== commentId;
            });
            if(this.post){
              this.post.comments--;
            }
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
  scrollToComments(): void {
    const commentsElement =
      this.elementRef.nativeElement.querySelector('.comments');
    commentsElement.scrollIntoView({ behavior: 'smooth' });
  }
}
