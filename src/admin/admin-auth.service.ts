import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class AdminAuthService {
	private baseUrl = 'http://localhost:8080/auth';

	constructor(private http: HttpClient) {
	}

	isAuthenticated = false;

	login(username: string, password: string): Observable<any> {
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		return this.http.post(`${this.baseUrl}/signin`, {name: username, password}, {headers});
	}

	signup(formData: any, adminRequestData : any): Observable<any> {
		const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
		return this.http.post(`${this.baseUrl}/signup`, {formData, adminRequestData}, { headers });
	}

	getPendingApplications(token: string): Observable<any[]> {
		const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
		return this.http.post<any[]>(`${this.baseUrl}/admin-requests`, {}, { headers });
	}

	approveApplication(username: string, token: string): Observable<void> {
		const headers = new HttpHeaders({Authorization: `Bearer ${token}`});
		return this.http.post<void>(`${this.baseUrl}/approve-admin`, {username}, {headers});
	}

	isAdmin(): boolean {
		const token = localStorage.getItem('token');
		if (!token) {
			return false;
		}

		try {
			const decodedToken = JSON.parse(atob(token.split('.')[1]));
			return decodedToken.role === 'admin'; // Предположим, что роль хранится в токене
		} catch (error) {
			return false;
		}
	}
}
