import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { authGuard } from './auth.guard';
import { EditUserComponent } from './components/auth/edit-user/edit-user.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PostComponent } from './components/post/post.component';
import { CreatePostComponent } from './components/create-post/create-post.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/edit', component: EditUserComponent, canActivate: [authGuard] },
  { path: ':username', component: ProfileComponent },
  { path: 'post/create', component: CreatePostComponent, canActivate: [authGuard] },
  { path: 'post/:id', component: PostComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
