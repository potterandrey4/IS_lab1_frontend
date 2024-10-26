import { Component, OnInit } from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
	AbstractControl,
	ValidationErrors, ReactiveFormsModule, ValidatorFn
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
	const value = control.value || '';
	return value.trim().length === 0 ? { noWhitespace: true } : null;
}

export function numberValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;
		return value !== null && !isNaN(value) ? null : { notANumber: true };
	};
}

export function minValue(min: number): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;
		return value !== null && value > min ? null : { min: true };
	};
}

export function maxValue(max: number): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value;
		return value !== null && value <= max ? null : { max: true };
	};
}

@Component({
	selector: 'app-create-space-marine',
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
	],
	templateUrl: './create-space-marine.component.html',
	styleUrls: ['./create-space-marine.component.css'],
})
export class CreateSpaceMarineComponent implements OnInit {
	spaceMarineForm: FormGroup;

	categories: string[] = ['Scout', 'Aggressor', 'Inceptor', 'Suppressor', 'Terminator'];
	weapons: string[] = ['Heavy boltgun', 'Bolt pistol', 'Bolt rifle', 'Combi flamer', 'Gravy gun'];

	constructor(private fb: FormBuilder, private toastr: ToastrService) {
		this.spaceMarineForm = this.fb.group({
			name: ['', [Validators.required, Validators.minLength(1), noWhitespaceValidator]],
			coordinates: this.fb.group({
				x: ['', [Validators.required, numberValidator(), minValue(-585), noWhitespaceValidator]],
				y: ['', [Validators.required, numberValidator(), maxValue(118), noWhitespaceValidator]],
			}),
			health: ['', [Validators.required, numberValidator(), minValue(0), noWhitespaceValidator]],
			height: ['', [Validators.required, numberValidator(), minValue(0), noWhitespaceValidator]],
			category: ['', [Validators.required, noWhitespaceValidator]],
			weaponType: ['', [Validators.required, noWhitespaceValidator]],
			chapter: this.fb.group({
				name: ['', [Validators.required, Validators.minLength(1), noWhitespaceValidator]],
				marinesCount: ['', [Validators.required, numberValidator(), minValue(0), maxValue(1000), noWhitespaceValidator]],
				world: ['', [noWhitespaceValidator]],
			}),
		});
	}

	ngOnInit(): void {}

	private trimFormValues(formGroup: FormGroup): void {
		Object.keys(formGroup.controls).forEach(key => {
			const control = formGroup.get(key);
			if (control instanceof FormGroup) {
				this.trimFormValues(control); // рекурсивный вызов для вложенных FormGroup
			} else if (typeof control?.value === 'string') {
				control.setValue(control.value.trim()); // обрезка пробелов
			}
		});
	}

	onSubmit() {
		this.trimFormValues(this.spaceMarineForm);
		if (this.spaceMarineForm.valid) {
			this.toastr.success('Данные успешно отправлены!', 'Успех');
			console.log(this.spaceMarineForm.value);
		} else {
			this.toastr.error('Форма содержит ошибки!', 'Ошибка');
		}
	}
}
