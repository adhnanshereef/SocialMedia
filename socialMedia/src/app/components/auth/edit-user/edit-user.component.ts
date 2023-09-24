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
  profilePicPreview: string | undefined;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      profile_pic: [null], // Make sure it matches the form control name in your template
      dateofbirth: [''],
    });
  }

  ngOnInit(): void {
    // Fetch user data when the component is initialized
    this.authService.getUser().subscribe({
      next: (data) => {
        const { profile_pic, ...userData } = data;

        this.user = data;
        this.userForm.patchValue(userData);
        this.profilePicPreview = `${BACKEND_URL}${data.profile_pic}`;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onProfilePicChange(event: any) {
    // Handle profile picture change
    const file = event.target.files[0];
    if (file) {
      this.userForm.patchValue({
        profile_pic: file,
      });
      this.userForm.get('profile_pic')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.profilePicPreview = reader.result as string;
      };
    }
  }

  onSubmit() {
    // Call editUser from AuthService with the user data and profile picture file
    this.authService.editUser(
      this.userForm.value
    );
  }
}
