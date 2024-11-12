import {Component, OnInit} from '@angular/core';
import {
	FormGroup,
	FormBuilder,
	Validators,
	AbstractControl,
	ValidationErrors, ReactiveFormsModule, ValidatorFn
} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ToastrService} from 'ngx-toastr';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatOptionModule} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {SpaceMarineService} from '../services/space-marine.service';
import {catchError, timeout} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Router} from '@angular/router';
import {maxValue, minValue, noWhitespaceValidator, numberValidator} from '../validators/custom-validators';


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

	constructor(private spaceMarineService: SpaceMarineService, private fb: FormBuilder, private toastr: ToastrService, private router: Router,) {
		this.spaceMarineForm = this.fb.group({
			name: ['1', [Validators.required, Validators.minLength(1), noWhitespaceValidator]],
			coordinates: this.fb.group({
				x: ['1', [Validators.required, numberValidator(), minValue(-585), noWhitespaceValidator]],
				y: ['1', [Validators.required, numberValidator(), maxValue(118), noWhitespaceValidator]],
			}),
			health: ['1', [Validators.required, numberValidator(), minValue(0), noWhitespaceValidator]],
			height: ['1', [Validators.required, numberValidator(), minValue(0), noWhitespaceValidator]],
			category: [this.categories[0], [Validators.required, noWhitespaceValidator]],
			weaponType: [this.weapons[0], [Validators.required, noWhitespaceValidator]],
			chapter: this.fb.group({
				name: ['1', [Validators.required, Validators.minLength(1), noWhitespaceValidator]],
				marinesCount: ['1', [Validators.required, numberValidator(), minValue(0), maxValue(1000), noWhitespaceValidator]],
				world: ['1', [noWhitespaceValidator]],
			}),
		});
	}

	ngOnInit(): void {
	}

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
		const formData = this.spaceMarineForm.value;
		if (this.spaceMarineForm.valid) {
			this.spaceMarineService.add(formData).pipe(
				timeout(3000),
				catchError(error => {
					if (error.name === 'TimeoutError') {
						this.toastr.error('Сервер не отвечает. Превышено время ожидания.', 'Ошибка входа:');
					} else if (error.status === 0) {
						this.toastr.error('Сервер недоступен', 'Ошибка входа:');
					} else {
						this.toastr.error(error.message || 'Неизвестная ошибка',);
					}
					return throwError(() => error);
				})
			).subscribe(
				(response: any) => {
					this.toastr.success(response.message);
					this.router.navigate(['/']);
				},
				error => {
					console.error(error);
				}
			);
		} else {
			this.toastr.error('Форма содержит ошибки!', 'Ошибка');
		}
	}
}
