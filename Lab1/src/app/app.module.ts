import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { SignInComponent } from '../signin/signin.component';
import { SignUpComponent } from '../signup/signup.component';
import { HomeComponent } from '../home/home.component';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { HeaderModule } from '../header/header.module';
import { ReactiveFormsModule } from '@angular/forms';
import {CreateSpaceMarineComponent} from '../create-space-marine/create-space-marine.component';

@NgModule({
	declarations: [
		AppComponent,
		SignInComponent,
		SignUpComponent,
		HomeComponent,
		CreateSpaceMarineComponent
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(routes),
		CommonModule,
		HeaderModule,
		ReactiveFormsModule
	],
	providers: [provideHttpClient()],
	bootstrap: [AppComponent]
})
export class AppModule { }
