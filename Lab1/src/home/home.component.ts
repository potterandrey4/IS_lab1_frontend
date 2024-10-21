import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [CommonModule, RouterLink]
})
export class HomeComponent {
  isLoggedIn = false;

  constructor(private authService: AuthService) {
    // Подписка на изменения статуса авторизации
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }
}
