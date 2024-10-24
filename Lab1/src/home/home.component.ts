import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';

@Component({
	standalone: true,
	selector: 'app-home',
	templateUrl: './home.component.html',
	imports: [CommonModule, RouterLink]
})
export class HomeComponent {
	isLoggedIn = false;

	constructor(private authService: AuthService, private router: Router) {}

	ngOnInit() {
		this.authService.isLoggedIn$.subscribe(loggedIn => {
			this.isLoggedIn = loggedIn;
		});
	}

	control_panel() {
		this.router.navigate(['/control-panel']);
	}
}
