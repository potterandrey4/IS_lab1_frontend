import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SpaceMarineService } from '../services/space-marine.service';
import { noWhitespaceValidator, numberValidator, minValue, maxValue } from '../validators/custom-validators';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';

@Component({
	selector: 'app-edit-space-marine',
	templateUrl: './edit-space-marine.component.html',
	styleUrls: ['./edit-space-marine.component.css'],
	imports: [
		ReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
	],
	standalone: true
})
export class EditSpaceMarineComponent implements OnInit {
	spaceMarineForm: FormGroup;
	categories = ['Scout', 'Aggressor', 'Inceptor', 'Suppressor', 'Terminator'];
	weapons = ['Heavy boltgun', 'Bolt pistol', 'Bolt rifle', 'Combi flamer', 'Gravy gun'];
	spaceMarineId!: number;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private toastr: ToastrService,
		private spaceMarineService: SpaceMarineService
	) {
		this.spaceMarineForm = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(1), noWhitespaceValidator]],
			coordinates: this.fb.group({
				x: ['', [Validators.required, numberValidator(), minValue(-585), noWhitespaceValidator]],
				y: ['', [Validators.required, numberValidator(), maxValue(118), noWhitespaceValidator]]
			}),
			health: ['', [Validators.required, numberValidator(), minValue(0), noWhitespaceValidator]],
			height: ['', [Validators.required, numberValidator(), minValue(0), noWhitespaceValidator]],
			category: ['', [Validators.required, noWhitespaceValidator]],
			weaponType: ['', [Validators.required, noWhitespaceValidator]],
			chapter: this.fb.group({
				name: ['', [Validators.required, Validators.minLength(1), noWhitespaceValidator]],
				marinesCount: ['', [Validators.required, numberValidator(), minValue(0), maxValue(1000), noWhitespaceValidator]],
				world: ['', [noWhitespaceValidator]]
			})
		});
	}

	ngOnInit(): void {
		this.spaceMarineId = Number(this.route.snapshot.paramMap.get('id'));
		this.loadSpaceMarineData();
	}

	private loadSpaceMarineData() {
		this.spaceMarineService.getById(this.spaceMarineId).subscribe(
			(data: any) => {
				this.spaceMarineForm.patchValue(data);
			},
			error => {
				this.toastr.error('Не удалось загрузить данные SpaceMarine');
			}
		);
	}

	onSubmit() {
		if (this.spaceMarineForm.valid) {
			const formData = this.spaceMarineForm.value;
			this.spaceMarineService.update(this.spaceMarineId, formData).subscribe(
				response => {
					this.toastr.success('SpaceMarine успешно обновлен');
					this.router.navigate(['/control-panel']);
				},
				error => {
					this.toastr.error('Ошибка при обновлении SpaceMarine');
				}
			);
		} else {
			this.toastr.error('Форма содержит ошибки');
		}
	}
}
