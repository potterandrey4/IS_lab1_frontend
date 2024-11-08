import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SpaceMarineService } from '../services/space-marine.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
	standalone: true,
	selector: 'app-home',
	templateUrl: './home.component.html',
	imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule]
})
export class HomeComponent {
	isLoggedIn = false;
	showAll = true;
	spaceMarines: any[] = [];
	isLoading = false;

	constructor(private authService: AuthService, private router: Router, private spaceMarineService: SpaceMarineService) {}

	ngOnInit() {
		this.authService.isLoggedIn$.subscribe(loggedIn => {
			this.isLoggedIn = loggedIn;
			this.loadSpaceMarines();
		});
	}

	control_panel() {
		this.router.navigate(['/control-panel']);
	}

	toggleView() {
		this.showAll = !this.showAll;
		this.loadSpaceMarines();
	}

	loadSpaceMarines() {
		if (this.isLoading) return;
		this.isLoading = true;

		if (this.showAll) {
			this.spaceMarineService.getAllSpaceMarines().subscribe(
				data => {
					this.spaceMarines = data;
					this.isLoading = false;
				},
				error => {
					console.error(error);
					this.isLoading = false;
				}
			);
		} else {
			this.spaceMarineService.getUserSpaceMarines().subscribe(
				data => {
					this.spaceMarines = data;
					this.isLoading = false;
				},
				error => {
					console.error(error);
					this.isLoading = false;
				}
			);
		}
	}
}
