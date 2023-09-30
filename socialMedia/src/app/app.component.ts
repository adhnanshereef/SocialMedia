import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { User } from './interfaces/auth';
import { UserService } from './services/user.service';
import { BACKEND_URL } from './config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  user: User | undefined = undefined;
  loaded: boolean = false;
  backend_url = BACKEND_URL;
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}
  logout() {
    this.authService.logOut();
  }
  ngOnInit() {
    const getuser = this.authService.returnUser();
    if (getuser) {
      getuser.subscribe({
        next: (data) => {
          this.userService.updateUser(data);
        },
        error: (error) => {
          console.log(error);
        },
      });
    } else {
      this.userService.updateUser(undefined);
    }

    this.userService.user$.subscribe((user) => {
      this.user = user;

      this.loaded = true;
    });
  }
}
