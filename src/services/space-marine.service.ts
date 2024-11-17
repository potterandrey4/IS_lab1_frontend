import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {SpaceMarine} from '../models/space-marine.model';
import {WebSocketSubject} from 'rxjs/webSocket';

@Injectable({
	providedIn: 'root',
})
export class SpaceMarineService {
	private baseUrl = 'http://localhost:8080/space-marine';
	private socket: WebSocketSubject<any>; // для WebSocket

	constructor(private http: HttpClient) {
		// Подключение к WebSocket серверу
		this.socket = new WebSocketSubject('ws://localhost:8080/socket');
	}

	private getHeaders(): HttpHeaders {
		const token = localStorage.getItem('authToken');
		return new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		});
	}

	getAllSpaceMarines(): Observable<SpaceMarine[]> {
		return this.http.post<SpaceMarine[]>(`${this.baseUrl}/all-objects`, null, {headers: this.getHeaders()});
	}

	getUserSpaceMarines(): Observable<SpaceMarine[]> {
		const options = { headers: this.getHeaders() };
		return this.http.post<SpaceMarine[]>(`${this.baseUrl}/user-objects`, null, options);
	}

	getSpaceMarinesUpdates(): Observable<SpaceMarine[]> {
		return this.socket.asObservable();
	}

	getSpaceMarineById(id: number): Observable<any> {
		const options = { headers: this.getHeaders() };
		return this.http.post(`${this.baseUrl}/get/${id}`, null, options);
	}

	add(formData: any): Observable<any> {
		return this.http.post(`${this.baseUrl}/add`, formData, {headers: this.getHeaders()}).pipe(
			tap(() => {
				this.socket.next('update');
			})
		);
	}

	updateSpaceMarine(id: number | null, formData: any): Observable<any> {
		return this.http.put(`${this.baseUrl}/update/${id}`, formData, {headers: this.getHeaders()}).pipe(
			tap(() => {
				this.socket.next('update');
			})
		);
	}


	delete(id: number): Observable<any> {
		return this.http.delete(`${this.baseUrl}/delete/${id}`, {headers: this.getHeaders()}).pipe(
			tap(() => {
				this.socket.next('update');
			})
		);
	}
}
