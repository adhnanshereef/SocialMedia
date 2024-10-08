import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { LoaderService } from 'src/app/services/loader.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  createPostForm: FormGroup = {} as FormGroup;
  photoPreview: string | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private postService: PostService,
    private titleService: Title,
    private loaderService: LoaderService
  ) {
    this.titleService.setTitle('Create Post | Social Media');
    this.createPostForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: [''],
      photo: [''],
    });
  }
  onPhotoChange(event: any) {
    // Handle profile picture change
    const file = event.target.files[0];
    if (file) {
      this.createPostForm.patchValue({
        photo: file,
      });
      this.createPostForm.get('photo')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
    }
  }

  onSubmit() {
    // Get the post data from the form
    const post = this.createPostForm.value;

    this.postService.createPost(post);
    this.loaderService.setLoader(true);
  }
}
