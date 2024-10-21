import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  templateUrl: './signin.component.html',
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink]
})
export class SignInComponent {
  constructor(private authService: AuthService) {}

  onLogin() {
    // Логика для проверки учетных данных
    // Если проверка успешна:
    this.authService.login();
  }
}
