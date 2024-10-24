import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-space-marine-form',
	templateUrl: './create-space-marine.component.html',
	styleUrls: ['./create-space-marine.component.css']
})
export class CreateSpaceMarineComponent implements OnInit {
	// spaceMarineForm: FormGroup;
	categories: string[] = ['SCOUT', 'AGGRESSOR', 'INCEPTOR', 'SUPPRESSOR', 'TERMINATOR'];
	weapons: string[] = ['HEAVY_BOLTGUN', 'BOLT_PISTOL', 'BOLT_RIFLE', 'COMBI_FLAMER', 'GRAV_GUN'];

	constructor(private fb: FormBuilder) {}

	ngOnInit(): void {
		// this.spaceMarineForm = this.fb.group({
		// 	name: ['', [Validators.required, Validators.minLength(1)]],
		// 	coordinates: this.fb.group({
		// 		x: [null, [Validators.required, Validators.min(-585)]],
		// 		y: [null, [Validators.required, Validators.max(118)]],
		// 	}),
		// 	chapter: this.fb.group({
		// 		name: ['', [Validators.required, Validators.minLength(1)]],
		// 		marinesCount: [null, [Validators.required, Validators.min(1), Validators.max(1000)]],
		// 		world: ['']
		// 	}),
		// 	health: [null, [Validators.required, Validators.min(1)]],
		// 	height: [null],
		// 	category: [null, Validators.required],
		// 	weaponType: [null, Validators.required],
		// });
	}

	onSubmit() {
		// if (this.spaceMarineForm.valid) {
		// 	console.log(this.spaceMarineForm.value);
		// }
	}
}
