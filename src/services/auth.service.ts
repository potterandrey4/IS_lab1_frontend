import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private apiUrl = 'http://localhost:8080/auth';

	private loggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
	public isLoggedIn$ = this.loggedInSubject.asObservable();

	private emailSubject = new BehaviorSubject<string | null>(this.getStoredEmail());
	public email$ = this.emailSubject.asObservable();

	constructor(private http: HttpClient, private toastr: ToastrService) {}

	login(formData: any): Observable<any> {
		return this.http.post(`${this.apiUrl}/signin`, formData);
	}

	signup(formData: any): Observable<any> {
		return this.http.post(`${this.apiUrl}/signup`, formData);
	}

	setToken(token: string, email: string): void {
		localStorage.setItem('authToken', token);
		localStorage.setItem('userEmail', email);
		this.loggedInSubject.next(true);
		this.emailSubject.next(email);
	}

	getToken(): string | null {
		return localStorage.getItem('authToken');
	}

	private getStoredEmail(): string | null {
		return localStorage.getItem('userEmail');
	}

	private hasToken(): boolean {
		return !!this.getToken();
	}

	logout(): void {
		localStorage.removeItem('authToken');
		localStorage.removeItem('userEmail'); // Удаление email
		this.loggedInSubject.next(false);
		this.emailSubject.next(null);
	}

	verifyToken(): Observable<boolean> {
		const token = this.getToken();

		if (!token) {
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

	getCurrentUserEmail(): string | null {
		return this.emailSubject.getValue();
	}
}
