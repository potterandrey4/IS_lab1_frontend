import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import {catchError, map, timeout} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private apiUrl = 'http://localhost:8080/auth';

	private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
	public isLoggedIn$ = this.loggedInSubject.asObservable();

	private usernameSubject = new BehaviorSubject<string | null>(null);
	public username$ = this.usernameSubject.asObservable();

	constructor(private http: HttpClient, private toastr: ToastrService) {}

	login(formData: any): Observable<any> {
		return this.http.post(`${this.apiUrl}/signin`, formData);
	}

	signup(formData: any): Observable<any> {
		return this.http.post(`${this.apiUrl}/signup`, formData);
	}

	// Метод для сохранения токена и имени пользователя
	setToken(token: string, username: string): void {
		localStorage.setItem('authToken', token);
		this.loggedInSubject.next(true);
		this.usernameSubject.next(username);
	}

	// Метод для получения токена из localStorage
	getToken(): string | null {
		return localStorage.getItem('authToken');
	}

	// Метод для проверки наличия токена
	private hasToken(): boolean {
		return !!this.getToken();
	}

	// Метод для выхода из системы
	logout(): void {
		localStorage.removeItem('authToken');
		this.loggedInSubject.next(false);
		this.usernameSubject.next(null);
	}

	// Метод для верификации токена на сервере
	verifyToken(): Observable<boolean> {
		const token = this.getToken();

		if (!token) {
			// Если токена нет, сразу возвращаем false
			this.loggedInSubject.next(false);
			return of(false);
		}

		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

		return this.http.post(`${this.apiUrl}/verify-token`, {}, { headers }).pipe(
			timeout(5000),
			map((response: any) => {
				this.loggedInSubject.next(true);
				return true;
			}),
			catchError((error) => {
				if (error.name === 'TimeoutError') {
					this.toastr.error('Сервер не отвечает. Превышено время ожидания.', 'Ошибка верификации токена:');
				} else {
					this.toastr.error('Ошибка верификации токена');
					this.loggedInSubject.next(false);
				}
				return of(false);
			})
		);
	}
}
