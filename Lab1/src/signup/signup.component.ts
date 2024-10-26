import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	ValidationErrors,
	Validators
} from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { ToastrService } from 'ngx-toastr';
import {catchError, timeout} from 'rxjs/operators';
import {throwError} from 'rxjs';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
	const value = control.value || '';
	return value.trim().length === 0 ? { noWhitespace: true } : null;
}

@Component({
	selector: 'app-signup',
	standalone: true,
	templateUrl: './signup.component.html',
	imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, ReactiveFormsModule]
})
export class SignUpComponent implements OnInit {
	signUpForm!: FormGroup;

	constructor(
		private authService: AuthService,
		private router: Router,
		private toastr: ToastrService,
		private fb: FormBuilder
	) {}

	ngOnInit() {
		this.signUpForm = this.fb.group(
			{
				username: ['', [Validators.required, Validators.minLength(1), noWhitespaceValidator]],
				email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
				password: ['', [Validators.required, Validators.minLength(6), noWhitespaceValidator]],
				confirmPassword: ['', [Validators.required, this.matchPasswords.bind(this)]]
			}
		);
	}

	matchPasswords(control: AbstractControl): ValidationErrors | null {
		const password = this.signUpForm?.get('password')?.value;
		const confirmPassword = control.value;
		return password !== confirmPassword ? { mismatch: true } : null;
	}

	onSignup() {
		if (this.signUpForm.invalid) {
			this.toastr.error('Пожалуйста, заполните форму корректно.');
			return;
		}

		const hashedPassword = CryptoJS.MD5(this.signUpForm.get('password')?.value).toString();
		const formData = {
			name: this.signUpForm.get('username')?.value,
			email: this.signUpForm.get('email')?.value,
			password: hashedPassword
		};

		this.authService.signup(formData).pipe(
			timeout(3000),
			catchError(error => {
				if (error.name === 'TimeoutError') {
					this.toastr.error('Превышено время ожидания.', 'Ошибка сервера:');
				} else if (error.status === 409) {
					this.toastr.info("Данный email занят, попробуйте другой или войдите в существующий аккаунт");
				} else if (error.status === 0) {
					this.toastr.error('Сервер недоступен', 'Ошибка сервера');
				}
				return throwError(() => error);
			})
		).subscribe(
			(response: any) => {
				if (response.token) {
					this.toastr.success('Вы зарегистрировались');
					this.authService.setToken(response.token, formData.name);
					this.router.navigate(['/']);
				} else {
					this.toastr.error(response.error, 'Ошибка регистрации');
				}
			},
			error => {
				console.error(error, 'Ошибка регистрации');
			}
		);
	}
}
