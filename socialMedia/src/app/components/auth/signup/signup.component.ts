import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SignupUser } from 'src/app/interfaces/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup = {} as FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.authenticationStatus()) {
      this.router.navigateByUrl('/');
    }
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    const signupData: SignupUser = this.signupForm.value;
    this.authService.signUp(
      signupData.username,
      signupData.name,
      signupData.email,
      signupData.password
    );
  }
}
