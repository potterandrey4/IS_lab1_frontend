import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
		// Подписка на изменения состояния авторизации
		this.authService.isLoggedIn$.subscribe(status => {
			this.isLoggedIn = status;
		});
		this.authService.username$.subscribe(username => {
			this.username = username; // Обновление имени пользователя
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
