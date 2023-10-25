import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { BACKEND_URL } from 'src/app/config';
import { User } from 'src/app/interfaces/auth';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

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
    private formBuilder: FormBuilder,
    private titleService: Title,
    private loaderService: LoaderService
  ) {
    this.titleService.setTitle('Edit User | Social Media');
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
    this.authService.fetchUser().subscribe({
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
    // Get the user data from the form
    const userData = this.userForm.value;
  
    // Format the date field before sending it to the server
    userData.dateofbirth = this.formatDate(userData.dateofbirth);
    
    // Call editUser from AuthService with the user data
    this.authService.editUser(userData);
    this.loaderService.setLoader(true);
  }
  
  formatDate(date: string): string | null {
    // Return null if the date is not set
    if (!date) {
      return null;
    }
    
    // Attempt to parse the input date string into a JavaScript Date object
    const parsedDate = new Date(date);
  
    // Check if the parsedDate is a valid Date object
    if (isNaN(parsedDate.getTime())) {
      // Return null if the date is invalid
      return null;
    }
  
    // Extract year, month, and day components from the Date object
    const year = parsedDate.getFullYear();
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day = parsedDate.getDate().toString().padStart(2, '0');
  
    // Return the formatted date as "yyyy-MM-dd"
    return `${year}-${month}-${day}`;
  }  
}
