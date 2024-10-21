import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  // Метод для проверки статуса авторизации
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  // Метод для авторизации пользователя
  login() {
    this.loggedIn.next(true);
  }

  // Метод для выхода пользователя
  logout() {
    this.loggedIn.next(false);
  }
}
