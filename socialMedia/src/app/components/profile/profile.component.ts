import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BACKEND_URL } from 'src/app/config';
import { User } from 'src/app/interfaces/auth';
import { FollowUser } from 'src/app/interfaces/profile';
import { AuthService } from 'src/app/services/auth.service';
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
  followers: FollowUser[] | null = null;
  following: FollowUser[] | null = null;
  userFollowings: Array<FollowUser> | null = null;
  followed: boolean = false;
  show: string = 'none';
  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
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
          } else {
            console.log(error);
          }
        },
      });
    } else {
      this.exist = false;
    }
    if (this.authService.authenticationStatus()) {
      this.profileService.getFollowings().subscribe({
        next: (data) => {
          this.userFollowings = data.following;
          if (
            Array.isArray(this.userFollowings) &&
            this.userFollowings.some((user) => user.username === username)
          ) {
            this.followed = true;
          } else {
            this.followed = false;
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
  getFollowersFollowing() {
    if (this.user) {
      this.profileService.getFollowersFollowings(this.user.username).subscribe({
        next: (data) => {
          this.followers = data.followers;
          this.following = data.following;
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }
  showFollowers() {
    if (!this.followers) {
      this.getFollowersFollowing();
    }
    this.show = 'followers';
  }
  showFollowing() {
    if (!this.following) {
      this.getFollowersFollowing();
    }
    this.show = 'following';
  }
  follow() {
    if (this.authService.isAuthenticated()) {
      if (this.user) {
        this.profileService.follow(this.user.username).subscribe({
          next: (data) => {
            if (data.do == 'follow') {
              if (this.userFollowings) {
                this.userFollowings.push(data.user);
              }
              if (this.followers) {
                this.followers.push(data.user);
              }

              if (this.user) {
                this.user.followers++;
              }
              this.followed = true;
            } else {
              if (this.userFollowings) {
                this.userFollowings = this.userFollowings.filter(
                  (user) => user.username !== data.user.username
                );
                if (this.followers) {
                  this.followers = this.followers.filter(
                    (user) => user.username !== data.user.username
                  );
                }
              }
              if (this.user && this.user.followers > 0) {
                this.user.followers--;
              }
              this.followed = false;
            }
          },

          error: (error) => {
            console.log(error);
          },
        });
      }
    }
  }
  close() {
    this.show = 'none';
  }
}
