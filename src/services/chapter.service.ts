import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Chapter} from '../models/space-marine.model';

@Injectable({
	providedIn: 'root',
})
export class ChapterService {
	private baseUrl = 'http://localhost:8080/chapter';

	constructor(private http: HttpClient) {
	}

	private getHeaders(): HttpHeaders {
		const token = localStorage.getItem('authToken');
		return new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		});
	}

	getChapters(): Observable<Chapter[]> {
		const options = {headers: this.getHeaders()};
		return this.http.post<Chapter[]>(`${this.baseUrl}/getAll`, null, options);
	}

	add(formData: any): Observable<any> {
		const options = {headers: this.getHeaders()};
		return this.http.post(`${this.baseUrl}/add`, formData, options);
	}
}
