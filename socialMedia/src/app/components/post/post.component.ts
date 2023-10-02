import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BACKEND_URL } from 'src/app/config';
import { Post } from 'src/app/interfaces/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  post: Post | undefined;
  loaded: boolean = false;
  backend_url = BACKEND_URL;
  constructor(
    private postService: PostService,
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
  }
}
