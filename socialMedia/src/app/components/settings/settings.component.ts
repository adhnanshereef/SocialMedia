import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  constructor(private authService: AuthService){}
  logout(){
    this.authService.logOut();
  }
  deleteUser(){
    this.authService.deleteAccount();
  }
}
