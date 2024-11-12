import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpaceMarineService } from '../services/space-marine.service';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { SpaceMarine } from '../models/space-marine.model';
import {MatCard, MatCardModule} from '@angular/material/card';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {maxValue, minValue, noWhitespaceValidator, numberValidator} from '../validators/custom-validators';
import {MatOptionModule} from '@angular/material/core';

@Component({
	selector: 'app-edit-space-marine',
	templateUrl: './edit-space-marine.component.html',
	standalone: true,

	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatOptionModule,
		MatCardModule,
		MatSelectModule,
		MatButtonModule
	]
})
export class EditSpaceMarineComponent implements OnInit {
	spaceMarineForm: FormGroup;
	marineId: number | null = null;
	categories: string[] = ['Scout', 'Aggressor', 'Inceptor', 'Suppressor', 'Terminator'];
	weapons: string[] = ['Heavy boltgun', 'Bolt pistol', 'Bolt rifle', 'Combi flamer', 'Gravy gun'];
	marineData: SpaceMarine | null = null;

	constructor(
		private route: ActivatedRoute,
		private spaceMarineService: SpaceMarineService,
		private fb: FormBuilder,
		private router: Router
	) {
		this.spaceMarineForm = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(1), noWhitespaceValidator]],
			coordinates: this.fb.group({
				x: ['', [Validators.required, numberValidator(), minValue(-585), noWhitespaceValidator]],
				y: ['', [Validators.required, numberValidator(), maxValue(118), noWhitespaceValidator]],
			}),
			health: ['', [Validators.required, numberValidator(), minValue(0), noWhitespaceValidator]],
			height: ['', [Validators.required, numberValidator(), minValue(0), noWhitespaceValidator]],
			category: [[Validators.required, noWhitespaceValidator]],
			weaponType: [[Validators.required, noWhitespaceValidator]],
			chapter: this.fb.group({
				name: ['', [Validators.required, Validators.minLength(1), noWhitespaceValidator]],
				marinesCount: ['', [Validators.required, numberValidator(), minValue(0), maxValue(1000), noWhitespaceValidator]],
				world: ['', [noWhitespaceValidator]],
			}),
		});
	}

	ngOnInit(): void {
		this.route.paramMap.subscribe(params => {
			this.marineId = Number(params.get('id'));
			if (this.marineId) {
				this.loadMarineData(this.marineId);
			}
		});
	}

	loadMarineData(id: number) {
		this.spaceMarineService.getSpaceMarineById(id).subscribe(
			(data) => {
				this.marineData = data;
				this.spaceMarineForm.patchValue({
					name: data.name,
					coordinates: {
						x: data.coordinates_x,
						y: data.coordinates_y,
					},
					health: data.health,
					height: data.height,
					category: data.category,
					weaponType: data.weaponType,
					chapter: {
						name: data.chapter_name,
						marinesCount: data.chapter_marinesCount,
						world: data.chapter_world
					},
				});
			},
			(error) => {
				console.error('Ошибка при загрузке данных:', error);
			}
		);
	}

	onSubmit() {
		if (this.spaceMarineForm.valid) {
			const updatedMarine = this.spaceMarineForm.value;
			this.spaceMarineService.updateSpaceMarine(this.marineId, updatedMarine).subscribe(
				(response) => {
					console.log('Space Marine обновлен', response);
					this.router.navigate(['/']);
				},
				(error) => {
					console.error('Ошибка при обновлении:', error);
				}
			);
		}
	}
}
