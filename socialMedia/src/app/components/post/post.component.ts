import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BACKEND_URL, FRONTEND_URL } from 'src/app/config';
import { User } from 'src/app/interfaces/auth';
import { Comment, Post } from 'src/app/interfaces/post';
import { AlertService } from 'src/app/services/alert.service';
import { PostService } from 'src/app/services/post.service';
import { SeoService } from 'src/app/services/seo.service';
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
    private route: ActivatedRoute,
    private seoService: SeoService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.postService.getPost(id).subscribe({
        next: (post) => {
          this.post = post;
          this.loaded = true;
          this.seoService.generateTags({
            title: `${this.post?.title}`,
            description: `${this.post?.content}`,
            image: `${
              this.post?.photo
                ? this.backend_url + this.post.photo
                : FRONTEND_URL + '/assets/logo.png'
            }`,
          });
        },
        error: (error) => {
          if (error.status == 404) {
            this.loaded = true;
          } else {
            this.alertService.setAlert(
              'Something went wrong, try again later.',
              error.status
            );
          }
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
        error: (error) => {
          this.alertService.setAlert(
            'Something went wrong, try again later.',
            error.status
          );
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
              if (this.post) {
                this.post.comments++;
              }
              this.newComment = '';
              this.scrollToComments();
            }
          },
          error: (error) => {
            this.alertService.setAlert(
              'Something went wrong, try again later.',
              error.status
            );
          },
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
            if (this.post) {
              this.post.comments--;
            }
          }
        },
        error: (error) => {
          this.alertService.setAlert(
            'Something went wrong, try again later.',
            error.status
          );
        },
      });
    }
  }
  scrollToComments(): void {
    const commentsElement =
      this.elementRef.nativeElement.querySelector('.comments');
    if (this.post && !this.comments) {
      this.postService.getComments(this.post.id.toString()).subscribe({
        next: (comments) => {
          this.comments = comments;
          if (commentsElement) {
            commentsElement.scrollIntoView({ behavior: 'smooth' });
          }
        },
        error: (error) => {
          this.alertService.setAlert(
            'Something went wrong, try again later.',
            error.status
          );
        },
      });
    } else {
      commentsElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
