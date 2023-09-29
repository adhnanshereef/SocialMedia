import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BACKEND_URL } from 'src/app/config';
import { User } from 'src/app/interfaces/auth';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User | undefined;
  exist: boolean = true;
  backendUrl = BACKEND_URL;
  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.profileService.getProfile(username).subscribe({
        next: (data) => {
          this.user = data;
          this.exist = true;
        },
        error: (error) => {
          if (error.status === 404) {
            this.exist = false;
          }else{
            console.log(error);
          }
        },
      });
    }else{
      this.exist = false;
    }
  }
}
