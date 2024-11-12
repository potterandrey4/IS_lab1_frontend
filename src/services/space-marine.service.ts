import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import {SpaceMarine} from '../models/space-marine.model';

@Injectable({
	providedIn: 'root',
})
export class SpaceMarineService {
	private baseUrl = 'http://localhost:8080/space-marine';

	constructor(private http: HttpClient, private toastr: ToastrService) {}

	private getHeaders(): HttpHeaders {
		const token = localStorage.getItem('authToken');
		return new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		});
	}

	getSpaceMarineById(id: number): Observable<any> {
		const options = { headers: this.getHeaders() };
		return this.http.post(`${this.baseUrl}/get/${id}`, null, options);
	}

	updateSpaceMarine(id: number | null, formData: any): Observable<any> {
		const options = { headers: this.getHeaders() };
		return this.http.put(`${this.baseUrl}/update/${id}`, formData, options);
	}

	delete(id: number): Observable<any> {
		const options = { headers: this.getHeaders() };
		return this.http.delete(`${this.baseUrl}/delete/${id}`, options);
	}

	add(formData: any): Observable<any> {
		const options = { headers: this.getHeaders() };
		return this.http.post(`${this.baseUrl}/add`, formData, options);
	}

	getAllSpaceMarines(): Observable<any> {
		const options = { headers: this.getHeaders() };
		return this.http.post(`${this.baseUrl}/all-objects`, null, options);
	}

	getUserSpaceMarines(): Observable<any> {
		const options = { headers: this.getHeaders() };
		return this.http.post(`${this.baseUrl}/user-objects`, null, options);
	}
}
