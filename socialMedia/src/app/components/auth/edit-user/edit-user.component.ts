import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BACKEND_URL } from 'src/app/config';
import { User } from 'src/app/interfaces/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  userForm: FormGroup;
  user: User | undefined;
  profilePicPreview: string | undefined ;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      profile_pic: [''],
      dateofbirth: [''],
    });
  }

  ngOnInit(): void {
    this.authService.getUser().subscribe({
      next: (data) => {
        this.user = data;
        this.userForm.patchValue(data);
        this.profilePicPreview = `${BACKEND_URL}${data.profile_pic}`;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onProfilePicChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.profilePicPreview = reader.result as string;
      };
    }
  }
}