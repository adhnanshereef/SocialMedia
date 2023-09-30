import { Component, OnInit } from '@angular/core';
import { BACKEND_URL } from 'src/app/config';
import { TokenUser, User } from 'src/app/interfaces/auth';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  Tuser: TokenUser = {} as TokenUser;
  user: User = {} as User;
  backend_url = BACKEND_URL;
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.Tuser = this.authService.getTokenUser();

    // this.authService.fetchUser().subscribe({
    //   next: (data) => {
    //     this.userService.updateUser(data);
    //   },
    //   error: (error) => {
    //     console.log(error);
    //   },
    // });
    this.userService.user$.subscribe({
      next: (data) => {
        if (data) {
          this.user = data;
        }
      },
    });
  }

  logout() {
    this.authService.logOut();
  }

  deleteAccount() {
    this.authService.deleteAccount();
  }
}
