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
import {ChapterService} from '../services/chapter.service';


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
	chapters: any[] = [];

	categories: string[] = ['Scout', 'Aggressor', 'Inceptor', 'Suppressor', 'Terminator'];
	weapons: string[] = ['Heavy boltgun', 'Bolt pistol', 'Bolt rifle', 'Combi flamer', 'Gravy gun'];

	constructor(private spaceMarineService: SpaceMarineService, private chapterService : ChapterService, private fb : FormBuilder, private toastr: ToastrService, private router: Router,) {
		this.spaceMarineForm = this.fb.group({
			name: ['1', [Validators.required]],
			coordinates: this.fb.group({
				x: ['1', [Validators.required, Validators.pattern(/^-?\d+$/), minValue(-585)]],
				y: ['1', [Validators.required, Validators.pattern(/^-?\d+(\.\d{1,15})?$/), maxValue(118)]],
			}),
			health: ['1', [Validators.required, numberValidator(), minValue(0)]],
			height: ['1', [Validators.required, numberValidator(), minValue(0)]],
			category: [this.categories[0], [Validators.required]],
			weaponType: [this.weapons[0], [Validators.required]],
			chapter: this.fb.group({
				id: [''],
				name: ['', [Validators.required]],
				marinesCount: ['', [Validators.required]],
				world: [''],
			}),
		});
	}

	ngOnInit(): void {
		this.loadChapters();
	}

	private loadChapters() {
		this.chapterService.getChapters().subscribe(
			(data) => {
				this.chapters = data;
			},
			(error) => {
				this.toastr.error('Не удалось загрузить Ордена');
			}
		);
	}

	validateNumber(event: Event, type: 'integer' | 'float') {
		const input = event.target as HTMLInputElement;
		if (type === 'integer') {
			input.value = input.value.replace(/[^-?\d]/g, '');
		} else if (type === 'float') {
			input.value = input.value.replace(/[^-?\d.]/g, '');
			if (input.value.indexOf('.') !== input.value.lastIndexOf('.')) {
				input.value = input.value.slice(0, input.value.lastIndexOf('.'));
			}
			if (input.value.indexOf('-') > 0) {
				input.value = input.value.replace('-', '');
			}
		}
	}

	onChapterSelect(event: any) {
		const selectedChapterId = event.value;

		if (selectedChapterId) {
			this.spaceMarineForm.get('chapter.name')?.disable();
			this.spaceMarineForm.get('chapter.marinesCount')?.disable();
			this.spaceMarineForm.get('chapter.world')?.disable();

			const selectedChapter = this.chapters.find(chapter => chapter.id === selectedChapterId);
			if (selectedChapter) {
				this.spaceMarineForm.patchValue({
					chapter: {
						name: selectedChapter.name,
						marinesCount: selectedChapter.count,
						world: selectedChapter.world
					}
				});
			}
		} else {
			this.spaceMarineForm.get('chapter.name')?.enable();
			this.spaceMarineForm.get('chapter.marinesCount')?.enable();
			this.spaceMarineForm.get('chapter.world')?.enable();

			this.spaceMarineForm.get('chapter.name')?.reset();
			this.spaceMarineForm.get('chapter.marinesCount')?.reset();
			this.spaceMarineForm.get('chapter.world')?.reset();
		}
	}


	private trimFormValues(formGroup: FormGroup): void {
		Object.keys(formGroup.controls).forEach(key => {
			const control = formGroup.get(key);
			if (control instanceof FormGroup) {
				this.trimFormValues(control);
			} else if (typeof control?.value === 'string') {
				control.setValue(control.value.trim());
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
