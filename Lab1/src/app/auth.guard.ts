import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService, private router: Router) {}

	canActivate(): Observable<boolean> {
		// Используем метод verifyToken для проверки токена на сервере
		return this.authService.verifyToken().pipe(
			map(isValid => {
				if (isValid) {
					return true;  // Пользователь авторизован
				} else {
					this.router.navigate(['/']);
					return false;
				}
			})
		);
	}
}
