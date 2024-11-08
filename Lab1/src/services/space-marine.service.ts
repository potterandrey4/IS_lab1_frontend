import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class SpaceMarineService {
	private baseUrl = 'http://localhost:8080/space-marine';
	private token = localStorage.getItem('authToken');
	private headers = new HttpHeaders({
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${this.token}`
	});

	constructor(private http: HttpClient, private toastr: ToastrService) {}

	// Получение Space Marine по ID
	getById(id: number): Observable<any> {
		const options = { headers: this.headers };
		return this.http.get(`${this.baseUrl}/${id}`, options);
	}

	// Обновление Space Marine
	update(id: number, formData: any): Observable<any> {
		const options = { headers: this.headers };
		return this.http.put(`${this.baseUrl}/update/${id}`, formData, options);
	}

	// Удаление Space Marine
	delete(id: number): Observable<any> {
		const options = { headers: this.headers };
		return this.http.delete(`${this.baseUrl}/delete/${id}`, options);
	}

	add(formData: any): Observable<any> {
		const options = { headers: this.headers };
		return this.http.post(`${this.baseUrl}/add`, formData, options);
	}

	getAllSpaceMarines(): Observable<any> {
		const options = { headers: this.headers };
		return this.http.post(`${this.baseUrl}/all-objects`, null, options);
	}

	getUserSpaceMarines(): Observable<any> {
		const options = {headers: this.headers};
		return this.http.post(`${this.baseUrl}/user-objects`, null, options);
	}
}
