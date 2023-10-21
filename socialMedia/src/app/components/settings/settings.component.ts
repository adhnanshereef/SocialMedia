import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  constructor(private authService: AuthService, private titleService: Title ){
    this.titleService.setTitle('Settings | Social Media');
  }
  logout(){
    this.authService.logOut();
  }
  deleteUser(){
    this.authService.deleteAccount();
  }
}
