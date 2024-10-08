import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { SignupUser } from 'src/app/interfaces/auth';
import { Title } from '@angular/platform-browser';
import { LoaderService } from 'src/app/services/loader.service';

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
    private router: Router,
    private titleService: Title,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Signup | Social Media');
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
    this.loaderService.setLoader(true);
  }
}
