import { Component } from '@angular/core';
import { AdminAuthService } from '../admin-auth.service';
import { NgForOf } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-admin-panel',
	templateUrl: './admin-control-panel.component.html',
	imports: [NgForOf],
	standalone: true,
})
export class AdminControlPanelComponent {
	pendingApplications: any[] = [];

	constructor(private adminAuthService: AdminAuthService) {
		this.loadPendingApplications();
	}

	loadPendingApplications() {
		const token = localStorage.getItem('token');
		if (!token) {
			alert('Вы не авторизованы');
			return;
		}

		this.adminAuthService.getPendingApplications(token).subscribe({
			next: (applications) => {
				this.pendingApplications = applications;
			},
			error: (err) => {
				alert('Ошибка загрузки заявок: ' + err.error.error);
			},
		});
	}

	approveApplication(username: string) {
		const token: string = <string>localStorage.getItem('token');
		this.adminAuthService.approveApplication(username, token).subscribe({
			next: () => {
				alert(`Заявка пользователя ${username} одобрена`);
				this.loadPendingApplications();
			},
			error: (err) => {
				alert('Ошибка утверждения заявки: ' + err.error.error);
			},
		});
	}
}
