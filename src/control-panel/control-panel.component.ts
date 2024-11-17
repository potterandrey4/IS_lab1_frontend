import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SpaceMarineService } from '../services/space-marine.service';
import { SpaceMarine } from '../models/space-marine.model';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
	selector: 'app-control-panel',
	standalone: true,
	imports: [MatButtonModule, FormsModule, NgIf, NgForOf],
	templateUrl: './control-panel.component.html',
	styleUrls: ['./control-panel.component.css'],
	providers: [SpaceMarineService]
})
export class ControlPanelComponent implements OnInit {
	averageHeight: number | null = null;
	categoryCount: number | null = null;
	searchResults: SpaceMarine[] = [];
	category: string = '';
	categories: string[] = ['Scout', 'Aggressor', 'Inceptor', 'Suppressor', 'Terminator'];
	nameSubstring: string = '';

	constructor(private router: Router, private spaceMarineService: SpaceMarineService) {}

	ngOnInit(): void {}

	create_space_marine() {
		this.router.navigate(['/control-panel/create-space-marine']);
	}

	create_chapter() {
		this.router.navigate(['/control-panel/create-chapter'])
	}

	calculateAvgHeight() {
		this.spaceMarineService.getAllSpaceMarines().subscribe({
			next: data => {
				const totalHeight = data.reduce((sum, marine) => sum + marine.height, 0);
				this.averageHeight = data.length ? totalHeight / data.length : 0;
			},
			error: error => console.error('Ошибка при расчете средней высоты:', error)
		});
	}

	getCategoryCount() {
		this.spaceMarineService.getAllSpaceMarines().subscribe({
			next: data => {
				this.categoryCount = data.filter(marine => marine.category === this.category).length;
			},
			error: error => console.error('Ошибка при получении количества объектов по категории:', error)
		});
	}

	searchByNameSubstring() {
		this.spaceMarineService.getAllSpaceMarines().subscribe({
			next: data => {
				this.searchResults = data.filter(marine => marine.name.startsWith(this.nameSubstring));
			},
			error: error => console.error('Ошибка при поиске по подстроке имени:', error)
		});
	}

}
