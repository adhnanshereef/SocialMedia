import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoginUser } from 'src/app/interfaces/auth';
import { Title } from '@angular/platform-browser';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = {} as FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private titleService: Title,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Login | Social Media');
    if (this.authService.authenticationStatus()) {
      this.router.navigateByUrl('/');
    }
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    const loginData: LoginUser = this.loginForm.value;
    this.authService.logIn(loginData.username, loginData.password);
    this.loaderService.setLoader(true);
  }
}
