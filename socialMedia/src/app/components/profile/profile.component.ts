import { isPlatformServer } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BACKEND_URL } from 'src/app/config';
import { User } from 'src/app/interfaces/auth';
import { MiniUser } from 'src/app/interfaces/profile';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { SeoService } from 'src/app/services/seo.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  auth_user: User | undefined;
  user: User | undefined;
  exist: boolean = true;
  backendUrl = BACKEND_URL;
  followers: MiniUser[] | null = null;
  following: MiniUser[] | null = null;
  userFollowings: Array<MiniUser> | null = null;
  followed: boolean = false;
  show: string = 'none';
  isServer: boolean;

  constructor(
    private profileService: ProfileService,
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private seoService: SeoService,
    private alertService: AlertService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isServer = isPlatformServer(platformId);
  }

  ngOnInit(): void {
    this.userService.user$.subscribe({
      next: (data) => {
        this.auth_user = data;
      },
    });

    // Subscribe to changes in the params property of the ActivatedRoute and fetch the user from the backend
    this.route.params.subscribe((params) => {
      const username = params['username'];
      this.followers = null;
      this.following = null;
      if (username) {
        this.profileService.getProfile(username).subscribe({
          next: (data) => {
            this.user = data;
            this.exist = true;
            this.seoService.generateTags({
              title: `@${this.user?.username} | Social Media`,
              description: `${this.user?.bio}`,
              image: `${this.backendUrl}${this.user?.profile_pic}`,
            });
          },
          error: (error) => {
            if (error.status === 404) {
              this.exist = false;
              this.seoService.generateTags({
                title: `User Not Found | Social Media`,
                description: `The user you are looking for does not exist.`,
              });
            } else {
              this.alertService.setAlert(
                'Something went wrong, try again later.',
                error.status
              );
            }
          },
        });
      } else {
        this.exist = false;
      }

      if (
        !this.isServer &&
        this.authService.authenticationStatus() &&
        username
      ) {
        this.profileService.getFollowings(username).subscribe({
          next: (data) => {
            if (data) {
              this.followed = true;
            } else {
              this.followed = false;
            }
          },
          error: (error) => {
            this.alertService.setAlert(
              'Something went wrong, try again later.',
              error.status
            );
          },
        });
      }
    });
  }

  getFollowersFollowing() {
    if (this.user) {
      this.profileService.getFollowersFollowings(this.user.username).subscribe({
        next: (data) => {
          this.followers = data.followers;
          this.following = data.following;
        },
        error: (error) => {
          this.alertService.setAlert(
            'Something went wrong, try again later.',
            error.status
          );
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
            this.alertService.setAlert(
              'Something went wrong, try again later.',
              error.status
            );
          },
        });
      }
    }
  }

  close() {
    this.show = 'none';
  }
}
