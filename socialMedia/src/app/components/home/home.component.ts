import { Component } from '@angular/core';
import { BACKEND_URL } from 'src/app/config';
import { TokenUser } from 'src/app/interfaces/auth';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  user: TokenUser = {} as TokenUser;
  backend_url = BACKEND_URL
  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
  }

}
