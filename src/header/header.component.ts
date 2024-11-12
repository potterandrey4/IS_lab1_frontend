import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	isLoggedIn = false;
	username: string | null = null;

	constructor(private authService: AuthService, private router: Router) {}

	ngOnInit(): void {
		this.authService.isLoggedIn$.subscribe(status => {
			this.isLoggedIn = status;
		});
		this.authService.email$.subscribe(email => {
			this.username = email;
		});

	}

	goHome() {
		this.router.navigate(['/']);
	}

	logout() {
		this.authService.logout();
		this.goHome();
	}

	login() {
		this.router.navigate(['/login']);
	}

	signup() {
		this.router.navigate(['/signup']);
	}
}
