import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import {CommonModule, DatePipe} from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SpaceMarineService } from '../services/space-marine.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {NotificationService} from '../services/notification.service';

@Component({
	standalone: true,
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css'],
	imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, MatButtonToggleModule, MatIcon, MatIconButton],
	providers: [DatePipe]
})
export class HomeComponent {
	isLoggedIn = false;
	spaceMarines: any[] = [];
	currentUserName: string | null = '';
	isLoading = false;
	selectedView: 'all' | 'mine' = 'all';
	sortColumn: string = '';
	sortDirection: 'asc' | 'desc' = 'asc';


	constructor(private authService: AuthService, private router: Router, private spaceMarineService: SpaceMarineService, private datePipe: DatePipe, private notificationService : NotificationService) {}

	ngOnInit() {
		this.authService.isLoggedIn$.subscribe(loggedIn => {
			this.isLoggedIn = loggedIn;
			this.loadSpaceMarines();
			if (this.isLoggedIn) {
				this.currentUserName = this.authService.getCurrentUserName();
			}

		});
	}

	control_panel() {
		this.router.navigate(['/control-panel']);
	}

	toggleView() {
		this.loadSpaceMarines();
	}

	loadSpaceMarines() {
		if (this.isLoading) return;
		this.isLoading = true;

		if (this.selectedView === 'all') {
			this.spaceMarineService.getAllSpaceMarines().subscribe(
				data => {
					this.spaceMarines = data;
					this.isLoading = false;
				},
				error => {
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

	editMarine(marine: any) {
		this.router.navigate([`/control-panel/edit/${marine.id}`]);
	}

	deleteMarine(marine: any) {
		console.log(marine.id);
		this.spaceMarineService.delete(marine.id).subscribe({
			next: (response) => {
				this.notificationService.success("Space Marine удален", response);
				this.loadSpaceMarines();
			},
			error: (error) => {
				this.notificationService.error("Ошибка при удалении объекта:", error);
			}
		});
	}

	formatDate(date: string): string {
		return this.datePipe.transform(date, 'dd.MM.yyyy HH:mm:ss')!;
	}

	sortTable(column: string): void {
		if (this.sortColumn === column) {
			this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			this.sortColumn = column;
			this.sortDirection = 'asc';
		}
		this.applySorting();
	}

	applySorting(): void {
		this.spaceMarines.sort((a, b) => {
			const aValue = a[this.sortColumn];
			const bValue = b[this.sortColumn];

			let comparison = 0;
			if (aValue > bValue) {
				comparison = 1;
			} else if (aValue < bValue) {
				comparison = -1;
			}

			return this.sortDirection === 'asc' ? comparison : -comparison;
		});
	}


}
