import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { SignInComponent } from '../signin/signin.component';
import { SignUpComponent } from '../signup/signup.component';
import { HomeComponent } from '../home/home.component';
import {routes} from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    CommonModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
