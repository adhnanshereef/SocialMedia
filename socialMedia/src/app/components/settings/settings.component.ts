import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent {
  constructor(
    private authService: AuthService,
    private titleService: Title,
    private loaderService: LoaderService
  ) {
    this.titleService.setTitle('Settings | Social Media');
  }
  logout() {
    this.authService.logOut();
  }
  deleteUser() {
    this.loaderService.setLoader(true);
    this.authService.deleteAccount();
  }
}
