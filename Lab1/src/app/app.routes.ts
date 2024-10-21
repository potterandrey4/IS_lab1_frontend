import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { SignInComponent } from '../signin/signin.component';
import { SignUpComponent } from '../signup/signup.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent }
];
