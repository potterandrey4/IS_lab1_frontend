import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import * as CryptoJS from 'crypto-js'; // Импортируйте CryptoJS

@Component({
	selector: 'app-signin',
	standalone: true,
	templateUrl: './signin.component.html',
	imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, FormsModule]
})
export class SignInComponent {
	username: string = '';
	password: string = '';

	constructor(private authService: AuthService, private router: Router) {
	}

	onLogin() {
		const hashedPassword = CryptoJS.MD5(this.password).toString(); // Хешируем пароль
		const formData = {
			name: this.username,
			password: hashedPassword // Используем хешированный пароль
		};

		this.authService.login(formData).subscribe(
			(response: any) => {
				if (response.token) {
					console.log('Успешный вход:', response.token);
					this.authService.setToken(response.token, this.username);
					this.router.navigate(['/']);
				} else {
					console.error('Ошибка входа:', response.error);
				}
			},
			error => {
				console.error('Ошибка входа:', error);
			}
		);
	}
}
