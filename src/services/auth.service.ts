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

	private nameSubject = new BehaviorSubject<string | null>(this.getStoredName());
	public name$ = this.nameSubject.asObservable();

	private isAdminSubject = new BehaviorSubject<boolean>(false); // Изначально считаем, что пользователь не администратор
	public isAdminIn$ = this.isAdminSubject.asObservable();


	constructor(private http: HttpClient, private toastr: ToastrService) {
		this.verifyAdminStatus();
	}

	login(formData: any): Observable<any> {
		return this.http.post(`${this.apiUrl}/signin`, formData);
	}

	signup(formData: any, adminRequestData : any): Observable<any> {
		return this.http.post(`${this.apiUrl}/signup`, {formData, adminRequestData});
	}

	setToken(token: string, name: string): void {
		localStorage.setItem('authToken', token);
		localStorage.setItem('userName', name);
		this.loggedInSubject.next(true);
		this.nameSubject.next(name);
	}

	getToken(): string | null {
		return localStorage.getItem('authToken');
	}

	private getStoredName(): string | null {
		return localStorage.getItem('userName');
	}

	private hasToken(): boolean {
		return !!this.getToken();
	}

	logout(): void {
		localStorage.removeItem('authToken');
		localStorage.removeItem('userName');
		this.loggedInSubject.next(false);
		this.nameSubject.next(null);
		this.isAdminSubject.next(false);
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

	verifyAdminStatus(): void {
		const token = this.getToken();
		if (!token) {
			this.isAdminSubject.next(false); // Если нет токена, значит, нет администратора
			return;
		}

		const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
		this.http.post<{ isAdmin: boolean }>(`${this.apiUrl}/user-status`, { headers }).pipe(
			map((response) => {
				this.isAdminSubject.next(response.isAdmin);
			}),
			catchError((error) => {
				this.isAdminSubject.next(false);
				return of(null);
			})
		).subscribe();
	}

	getCurrentUserName(): string | null {
		return this.nameSubject.getValue();
	}
}
