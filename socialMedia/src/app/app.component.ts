import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { AuthService } from './services/auth.service';
import { User } from './interfaces/auth';
import { UserService } from './services/user.service';
import { BACKEND_URL } from './config';
import { AlertService } from './services/alert.service';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  user: User | undefined = undefined;
  loaded: boolean = false;
  backend_url = BACKEND_URL;
  alerts: string[] = [];
  private timer: any;
  isServer: boolean;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertService: AlertService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isServer = isPlatformServer(platformId);
  }
  logout() {
    this.authService.logOut();
  }
  ngOnInit() {
    if (!this.isServer) {
      const getuser = this.authService.returnUser();
      if (getuser) {
        getuser.subscribe({
          next: (data) => {
            this.userService.updateUser(data);
          },
          error: (error) => {
            this.alertService.setAlert(
              'Something went wrong, try again later.',
              error.status
            );
          },
        });
      } else {
        this.userService.updateUser(undefined);
      }
    }

    this.userService.user$.subscribe((user) => {
      this.user = user;

      this.loaded = true;
    });

    // Alerts.
    this.alertService.alert$.subscribe((alerts) => {
      this.alerts = alerts;
      if (alerts.length > 0) {
        this.startTimer();
      } else {
        clearInterval(this.timer);
      }
    });
  }

  private startTimer() {
    if (!this.isServer) {
      this.timer = setInterval(() => {
        this.alertService.removeFirstAlert();
      }, 6000);
    }
  }

  ngOnDestroy(): void {
    if (!this.isServer && this.timer) clearInterval(this.timer);
  }
}
