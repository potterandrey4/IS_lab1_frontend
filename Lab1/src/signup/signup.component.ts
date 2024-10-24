import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
	imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, FormsModule, ReactiveFormsModule]
})
export class SignUpComponent {
	username: string = '';
	email: string = '';
	password: string = '';

	constructor(private authService: AuthService, private router: Router) {
	}

	onSignup() {
		const hashedPassword = CryptoJS.MD5(this.password).toString(); // Хешируем пароль
		const formData = {
			name: this.username,
			email: this.email,
			password: hashedPassword
		};

		this.authService.signup(formData).subscribe(
			(response: any) => {
				if (response.token) {
					console.log('Вы зарегистрировались:', response.token);
					this.authService.setToken(response.token, this.username);
					this.router.navigate(['/']);
				} else {
					console.error('Ошибка регистрации:', response.error);
				}
			},
			error => {
				console.error('Ошибка регистрации:', error);
			}
		);
	}
}
